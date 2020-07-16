<template>
  <page
    :title="'Menu items'"
    :is-content-loading="isInitialLoading"
    :footer="{
      backHref: menuListRoutePath,
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <menu-item-tree
      v-if="menuItemList.length > 0"
      :menu-item-list="menuItemList"
      @menu-item:edit="handleMenuItemEdit"
      @menu-item:add-child="handleMenuItemAddChild"
      @menu-item:remove="handleMenuItemRemove"
    />
    <span v-else>No items found</span>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { convertRequestErrorToMap, Nullable } from '@tager/admin-services';

import { MENU_ROUTE_PATHS } from '../../constants/paths';
import { getMenuItemList, updateMenuItemList } from '../../services/requests';
import { MenuItemType } from '../../typings/model';

import MenuItemTree from './components/MenuItemTree.vue';

function findMenuItemById(
  itemList: Array<MenuItemType>,
  itemId: number
): Nullable<MenuItemType> {
  for (const item of itemList) {
    if (item.id === itemId) return item;

    if (item.children.length > 0) {
      const foundItem = findMenuItemById(item.children, itemId);
      if (foundItem) return foundItem;
    }
  }

  return null;
}

function removeMenuItemById(
  itemList: Array<MenuItemType>,
  itemId: number
): Array<MenuItemType> {
  return itemList.filter((item) => {
    if (item.id === itemId) return false;

    item.children = removeMenuItemById(item.children, itemId);

    return true;
  });
}

export default Vue.extend({
  name: 'MenuItemList',
  components: { MenuItemTree },
  data(): {
    menuItemList: Array<MenuItemType>;
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
  },
  mounted(): void {
    this.isInitialLoading = true;

    getMenuItemList(this.menuAlias)
      .then((response) => {
        this.menuItemList = response.data;
      })
      .catch(console.error)
      .finally(() => {
        this.isInitialLoading = false;
      });
  },
  methods: {
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
    handleMenuItemAddChild(event: { itemId: number }) {
      const foundItem = findMenuItemById(this.menuItemList, event.itemId);

      if (foundItem) {
        foundItem.children.push({
          id: Math.round(Math.random() * 1000000),
          label: '',
          link: '',
          isNewTab: false,
          children: [],
        });
      }
    },
    handleMenuItemRemove(event: { itemId: number }) {
      this.menuItemList = removeMenuItemById(this.menuItemList, event.itemId);
    },
    submitForm() {
      this.isSubmitting = true;

      updateMenuItemList(this.menuAlias, this.menuItemList)
        .then(() => {
          this.errors = {};
          this.$router.push(MENU_ROUTE_PATHS.MENU_LIST);

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
