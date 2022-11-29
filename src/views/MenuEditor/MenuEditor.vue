<template>
  <Page
    :title="pageTitle"
    :is-content-loading="isInitialLoading"
    :footer="{
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <div v-if="itemCount >= 5" class="top-row">
      <BaseButton variant="outline-primary" @click="addMenuItemToRootStart">
        {{ $i18n.t("menus:addMenuItem") }}
      </BaseButton>
    </div>
    <MenuItemTree
      v-if="menuItemList.length > 0"
      :menu-item-list="menuItemList"
      :is-supports-tree="isSupportsTree"
      @menu-item:update-status="handleMenuItemStatusUpdate"
      @menu-item:edit="handleMenuItemEdit"
      @menu-item:add-child="handleAddChildToMenuItemWithId"
      @menu-item:remove="handleMenuItemRemove"
      @menu-item:move="handleMenuItemMove"
    />
    <div class="bottom-row">
      <BaseButton variant="outline-primary" @click="addMenuItemToRootEnd">
        {{ $i18n.t("menus:addMenuItem") }}
      </BaseButton>
    </div>
  </Page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  type SetupContext,
  watch
} from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  convertRequestErrorToMap,
  type Nullable,
  useResource,
  useI18n,
  useToast
} from "@tager/admin-services";
import { BaseButton, TagerFormSubmitEvent } from "@tager/admin-ui";
import { Page } from "@tager/admin-layout";

import { getMenuByAlias, updateMenuItemList } from "../../services/requests";
import type { MenuType } from "../../typings/model";

import MenuItemTree from "./components/MenuItemTree.vue";
import type { EditableMenuItemType } from "./MenuEditor.types";
import {
  convertToEditableMenuItems,
  findArrayContainingMenuItemWithId,
  findMenuItemById,
  getItemCount,
  moveMenuItemById,
  removeMenuItemById
} from "./MenuEditor.helpers";

export default defineComponent({
  name: "MenuEditor",
  components: { BaseButton, MenuItemTree, Page },
  setup() {
    const i18n = useI18n();
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    const menuAlias = computed(() => route.params.menuAlias as string);

    const [fetchMenu, { data: menu, loading }] = useResource<Nullable<MenuType>>({
      fetchResource: () => getMenuByAlias(menuAlias.value),
      initialValue: null,
      resourceName: "Menu"
    });

    const pageTitle = computed<string>(() =>
      menu.value
        ? `${menu.value.name} - ${i18n.t("menus:menuItems")}`
        : i18n.t("menus:menuItems")
    );

    onMounted(() => {
      fetchMenu();
    });

    const isSupportsTree = computed(() => menu.value?.supportsTree);
    const menuItemList = ref<Array<EditableMenuItemType>>([]);

    watch(menu, () => {
      menuItemList.value = convertToEditableMenuItems(menu.value?.items ?? []);
    });

    watch(menuAlias, () => {
      if (menuAlias) {
        fetchMenu();
      }
    });

    const itemCount = computed(() => getItemCount(menuItemList.value));

    function handleMenuItemEdit(event: {
      itemId: number;
      payload: { label: string; link: string; isNewTab: boolean };
    }) {
      const foundItem = findMenuItemById(menuItemList.value, event.itemId);

      console.log("foundItem", foundItem);
      if (foundItem) {
        foundItem.label = event.payload.label;
        foundItem.link = event.payload.link;
        foundItem.isNewTab = event.payload.isNewTab;
      }
    }

    function handleMenuItemStatusUpdate(event: {
      itemId: number;
      payload: { status: EditableMenuItemType["status"] };
    }) {
      const foundItem = findMenuItemById(menuItemList.value, event.itemId);

      if (foundItem) {
        foundItem.status = event.payload.status;
      }
    }

    function createNewMenuItem(): EditableMenuItemType {
      return {
        id: Math.round(Math.random() * 1000000),
        label: "",
        link: "",
        isNewTab: false,
        status: "EDITING_NEW",
        children: []
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
      direction: "up" | "down";
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

    function submitForm({ type }: TagerFormSubmitEvent) {
      isSubmitting.value = true;

      updateMenuItemList(menuAlias.value, menuItemList.value)
        .then(() => {
          errors.value = {};

          if (type === "save_exit") {
            router.push("/");
          }

          toast.show({
            variant: "success",
            title: i18n.t("menus:success"),
            body: i18n.t("menus:settingsHaveBeenSuccessfullyUpdated")
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          toast.show({
            variant: "danger",
            title: i18n.t("menus:error"),
            body: i18n.t("menus:settingsUpdateHaveBeenFailed")
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    }

    return {
      menuItemList,
      errors,
      isSubmitting,
      isInitialLoading: loading,
      isSupportsTree,
      itemCount,
      pageTitle,
      handleAddChildToMenuItemWithId,
      addMenuItemToRootStart,
      addMenuItemToRootEnd,
      handleMenuItemRemove,
      handleMenuItemMove,
      handleMenuItemEdit,
      handleMenuItemStatusUpdate,
      submitForm
    };
  }
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
