<template>
  <page
    :title="pageTitle"
    :is-content-loading="isInitialLoading"
    :footer="{
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <div v-if="itemCount >= 5" class="top-row">
      <base-button variant="outline-primary" @click="addMenuItemToRootStart">
        {{ t('menus:addMenuItem') }}
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
    <div class="bottom-row">
      <base-button variant="outline-primary" @click="addMenuItemToRootEnd">
        {{ t('menus:addMenuItem') }}
      </base-button>
    </div>
  </page>
</template>

<script lang="ts">
import {
  convertRequestErrorToMap,
  Nullable,
  useResource,
} from '@tager/admin-services';

import { getMenuListUrl } from '../../utils/paths';
import {
  getMenuByAlias,
  getMenuItemList,
  updateMenuItemList,
} from '../../services/requests';

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
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import { MenuItemType, MenuType } from '../../typings/model';
import { useTranslation } from '@tager/admin-ui';

export default defineComponent({
  name: 'MenuEditor',
  components: { MenuItemTree },
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

    const menuAlias = computed<string>(
      () => context.root.$route.params.menuAlias
    );

    const [fetchMenu, { data: menu }] = useResource<Nullable<MenuType>>({
      fetchResource: () => getMenuByAlias(menuAlias.value),
      initialValue: null,
      context,
      resourceName: 'Menu',
    });

    const pageTitle = computed<string>(() =>
      menu.value
        ? `${menu.value.label} - ${t('menus:menuItems')}`
        : t('menus:menuItems')
    );

    const [
      fetchMenuItemList,
      { data: originalMenuItemList, loading },
    ] = useResource<Array<MenuItemType>>({
      fetchResource: () => getMenuItemList(menuAlias.value),
      initialValue: [],
      context,
      resourceName: 'Menu items',
    });

    onMounted(() => {
      fetchMenuItemList();
      fetchMenu();
    });

    const menuItemList = ref<Array<EditableMenuItemType>>([]);

    watch(originalMenuItemList, () => {
      menuItemList.value = convertToEditableMenuItems(
        originalMenuItemList.value
      );
    });

    watch(menuAlias, () => {
      fetchMenuItemList();
      fetchMenu();
    });

    const itemCount = computed<number>(() => getItemCount(menuItemList.value));

    function handleMenuItemEdit(event: {
      itemId: number;
      payload: { label: string; link: string; isNewTab: boolean };
    }) {
      const foundItem = findMenuItemById(menuItemList.value, event.itemId);

      if (foundItem) {
        foundItem.label = event.payload.label;
        foundItem.link = event.payload.link;
        foundItem.isNewTab = event.payload.isNewTab;
      }
    }

    function handleMenuItemStatusUpdate(event: {
      itemId: number;
      payload: { status: EditableMenuItemType['status'] };
    }) {
      const foundItem = findMenuItemById(menuItemList.value, event.itemId);

      if (foundItem) {
        foundItem.status = event.payload.status;
      }
    }

    function createNewMenuItem(): EditableMenuItemType {
      return {
        id: Math.round(Math.random() * 1000000),
        label: '',
        link: '',
        isNewTab: false,
        status: 'EDITING_NEW',
        children: [],
      };
    }

    function handleAddChildToMenuItemWithId(event: { itemId: number }) {
      const foundItem = findMenuItemById(menuItemList.value, event.itemId);

      if (foundItem) {
        foundItem.children.unshift(createNewMenuItem());
      }
    }

    function addMenuItemToRootStart() {
      menuItemList.value.unshift(createNewMenuItem());
    }

    function addMenuItemToRootEnd() {
      menuItemList.value.push(createNewMenuItem());
    }

    function handleMenuItemRemove(event: { itemId: number }) {
      removeMenuItemById(menuItemList.value, event.itemId);
    }

    function handleMenuItemMove(event: {
      itemId: number;
      direction: 'up' | 'down';
    }) {
      const childList = findArrayContainingMenuItemWithId(
        menuItemList.value,
        event.itemId
      );

      if (!childList) return;

      moveMenuItemById(childList, event.itemId, event.direction);
    }

    const isSubmitting = ref<boolean>(false);
    const errors = ref<Record<string, string>>({});

    function submitForm({ shouldExit }: { shouldExit: boolean }) {
      isSubmitting.value = true;

      updateMenuItemList(menuAlias.value, menuItemList.value)
        .then(() => {
          errors.value = {};

          if (shouldExit) {
            context.root.$router.push('/');
          }

          context.root.$toast({
            variant: 'success',
            title: t('menus:success'),
            body: t('menus:settingsHaveBeenSuccessfullyUpdated'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: t('menus:error'),
            body: t('menus:settingsUpdateHaveBeenFailed'),
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    }

    return {
      t,
      menuItemList,
      errors: {},
      isSubmitting,
      isInitialLoading: loading,
      menuListRoutePath: getMenuListUrl(),
      itemCount,
      pageTitle,
      handleAddChildToMenuItemWithId,
      addMenuItemToRootStart,
      addMenuItemToRootEnd,
      handleMenuItemRemove,
      handleMenuItemMove,
      handleMenuItemEdit,
      handleMenuItemStatusUpdate,
      submitForm,
    };
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
