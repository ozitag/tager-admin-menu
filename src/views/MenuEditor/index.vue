<template>
  <page
    title="Menu items"
    :is-content-loading="isInitialLoading"
    :footer="{
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <div class="top-row">
      <base-button variant="outline-primary" @click="addMenuItemToRootStart">
        Add menu item
      </base-button>
    </div>
    <menu-item-tree
      v-if="menuItemList.length > 0"
      :menu-item-list="menuItemList"
      @menu-item:update-status="handleMenuItemStatusUpdate"
      @menu-item:edit="handleMenuItemEdit"
      @menu-item:add-child="handleAddChildToMenuItemWithId"
      @menu-item:remove="handleMenuItemRemove"
      @menu-item:move="handleMenuItemMove"
    />
    <div v-if="itemCount >= 5" class="bottom-row">
      <base-button variant="outline-primary" @click="addMenuItemToRootEnd">
        Add menu item
      </base-button>
    </div>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { convertRequestErrorToMap } from '@tager/admin-services';

import { MENU_ROUTE_PATHS } from '../../constants/paths';
import { getMenuItemList, updateMenuItemList } from '../../services/requests';

import MenuItemTree from './components/MenuItemTree.vue';
import { EditableMenuItemType } from './MenuEditor.types';
import {
  convertToEditableMenuItems,
  findArrayContainingMenuItemWithId,
  findMenuItemById,
  getItemCount,
  moveMenuItemById,
  removeMenuItemById,
} from './MenuEditor.helpers';

export default Vue.extend({
  name: 'MenuEditor',
  components: { MenuItemTree },
  data(): {
    menuItemList: Array<EditableMenuItemType>;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isInitialLoading: boolean;
    menuListRoutePath: string;
  } {
    return {
      menuItemList: [],
      errors: {},
      isSubmitting: false,
      isInitialLoading: false,
      menuListRoutePath: MENU_ROUTE_PATHS.MENU_LIST,
    };
  },
  computed: {
    menuAlias(): string {
      return this.$route.params.menuAlias;
    },
    itemCount(): number {
      return getItemCount(this.menuItemList);
    },
  },
  watch: {
    menuAlias() {
      this.refreshMenuItemList();
    },
  },
  mounted(): void {
    this.refreshMenuItemList();
  },
  methods: {
    refreshMenuItemList() {
      this.isInitialLoading = true;

      getMenuItemList(this.menuAlias)
        .then((response) => {
          this.menuItemList = convertToEditableMenuItems(response.data);
        })
        .catch((error) => {
          console.error(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Menu items fetching has been failed',
          });
        })
        .finally(() => {
          this.isInitialLoading = false;
        });
    },
    handleMenuItemEdit(event: {
      itemId: number;
      payload: { label: string; link: string; isNewTab: boolean };
    }) {
      const foundItem = findMenuItemById(this.menuItemList, event.itemId);

      if (foundItem) {
        foundItem.label = event.payload.label;
        foundItem.link = event.payload.link;
        foundItem.isNewTab = event.payload.isNewTab;
      }
    },
    handleMenuItemStatusUpdate(event: {
      itemId: number;
      payload: { status: EditableMenuItemType['status'] };
    }) {
      const foundItem = findMenuItemById(this.menuItemList, event.itemId);

      if (foundItem) {
        foundItem.status = event.payload.status;
      }
    },
    createNewMenuItem(): EditableMenuItemType {
      return {
        id: Math.round(Math.random() * 1000000),
        label: '',
        link: '',
        isNewTab: false,
        status: 'EDITING',
        children: [],
      };
    },
    handleAddChildToMenuItemWithId(event: { itemId: number }) {
      const foundItem = findMenuItemById(this.menuItemList, event.itemId);

      if (foundItem) {
        foundItem.children.unshift(this.createNewMenuItem());
      }
    },
    addMenuItemToRootStart() {
      this.menuItemList.unshift(this.createNewMenuItem());
    },
    addMenuItemToRootEnd() {
      this.menuItemList.push(this.createNewMenuItem());
    },
    handleMenuItemRemove(event: { itemId: number }) {
      this.menuItemList = removeMenuItemById(this.menuItemList, event.itemId);
    },
    handleMenuItemMove(event: { itemId: number; direction: 'up' | 'down' }) {
      const childList = findArrayContainingMenuItemWithId(
        this.menuItemList,
        event.itemId
      );

      if (!childList) return;

      moveMenuItemById(childList, event.itemId, event.direction);
    },
    submitForm() {
      this.isSubmitting = true;

      updateMenuItemList(this.menuAlias, this.menuItemList)
        .then(() => {
          this.errors = {};
          this.$router.push('/');

          this.$toast({
            variant: 'success',
            title: 'Success',
            body: 'Settings have been successfully updated',
          });
        })
        .catch((error) => {
          console.error(error);
          this.errors = convertRequestErrorToMap(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Settings update have been failed',
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
});
</script>

<style scoped lang="scss">
.top-row {
  margin-bottom: 1rem;
}
.bottom-row {
  margin-top: 1rem;
}
</style>
