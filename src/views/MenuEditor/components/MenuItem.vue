<template>
  <div class="menu-item">
    <div class="inner">
      <div class="left">
        <div>
          {{ labelPrefix }} <b>{{ menuItem.label }}</b>
        </div>
        <em class="link">{{ menuItem.link }}</em>
      </div>

      <div class="right">
        <BaseButton
          v-if="!isEditing"
          variant="icon"
          :title="$i18n.t('menus:edit')"
          @click="startEditing"
        >
          <EditIcon />
        </BaseButton>

        <BaseButton
          v-if="isSupportsTree && !isEditing"
          variant="icon"
          :title="$i18n.t('menus:addChildItem')"
          @click="addChild"
        >
          <AddCircleIcon />
        </BaseButton>

        <BaseButton
          v-if="!isEditing"
          variant="icon"
          :title="$i18n.t('menus:moveUp')"
          :disabled="index === 0"
          @click="moveMenuItem('up')"
        >
          <NorthIcon />
        </BaseButton>

        <BaseButton
          v-if="!isEditing"
          variant="icon"
          :title="$i18n.t('menus:moveDown')"
          :disabled="index === itemList.length - 1"
          @click="moveMenuItem('down')"
        >
          <SouthIcon />
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="$i18n.t('menus:delete')"
          @click="removeMenuItem"
        >
          <DeleteIcon />
        </BaseButton>
      </div>
    </div>

    <form
      v-if="isEditing"
      novalidate
      class="item-form"
      @submit.prevent="submitEditing"
    >
      <fieldset>
        <FormField
          :id="menuItem.id + '_label'"
          v-model:value="itemDraft.label"
          :name="menuItem.id + '_label'"
          :label="$i18n.t('menus:name')"
          autofocus
        />
        <FormField
          :id="menuItem.id + '_link'"
          v-model:value="itemDraft.link"
          :name="menuItem.id + '_link'"
          :label="$i18n.t('menus:link')"
        />
        <FormFieldCheckbox
          :id="menuItem.id + '_isNewTab'"
          v-model:checked="itemDraft.isNewTab"
          :name="menuItem.id + '_isNewTab'"
          :label="$i18n.t('menus:isNewTab')"
        />
      </fieldset>

      <div class="form-bottom">
        <BaseButton
          variant="secondary"
          :title="$i18n.t('menus:cancelChanges')"
          @click="cancelEditing"
        >
          {{ $i18n.t("menus:cancel") }}
        </BaseButton>

        <BaseButton
          variant="primary"
          type="submit"
          :title="$i18n.t('menus:saveChanges')"
        >
          {{ $i18n.t("menus:save") }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  watch,
} from "vue";

import type { Nullable } from "@tager/admin-services";
import {
  BaseButton,
  FormField,
  FormFieldCheckbox,
  EditIcon,
  NorthIcon,
  SouthIcon,
  DeleteIcon,
  AddCircleIcon,
} from "@tager/admin-ui";

import type { EditableMenuItemType } from "../MenuEditor.types";

interface MenuItemDraft {
  label: string;
  link: Nullable<string>;
  isNewTab: boolean;
}

interface Props {
  menuItem: EditableMenuItemType;
  index: number;
  indexPath: number[];
  itemList: Array<EditableMenuItemType>;
  isSupportsTree: boolean;
}

export default defineComponent({
  name: "MenuItem",
  components: {
    BaseButton,
    FormField,
    FormFieldCheckbox,
    EditIcon,
    NorthIcon,
    SouthIcon,
    DeleteIcon,
    AddCircleIcon,
  },
  props: {
    menuItem: {
      type: Object as PropType<Props["menuItem"]>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    indexPath: {
      type: Array as PropType<Props["indexPath"]>,
      required: true,
    },
    itemList: {
      type: Array as PropType<Props["itemList"]>,
      required: true,
    },
    isSupportsTree: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "menu-item:update-status",
    "menu-item:add-child",
    "menu-item:remove",
    "menu-item:move",
    "menu-item:edit",
  ],
  setup(props: Props, context) {
    const initialDraft = computed<MenuItemDraft>(() => ({
      label: props.menuItem.label,
      link: props.menuItem.link,
      isNewTab: props.menuItem.isNewTab,
    }));

    const itemDraft = ref<MenuItemDraft>({ ...initialDraft.value });

    const isEditing = computed(() => {
      return ["EDITING", "EDITING_NEW"].includes(props.menuItem.status);
    });

    function focusLabelInput() {
      const inputElement = document.getElementById(
        props.menuItem.id + "_label"
      ) as Nullable<HTMLInputElement>;

      if (inputElement) {
        inputElement.focus();
      }
    }

    watch(isEditing, () => {
      if (!isEditing.value) return;

      nextTick(focusLabelInput);
    });

    function escapeListener(event: KeyboardEvent) {
      if (event.key === "Escape" && isEditing.value) {
        cancelEditing();
      }
    }

    onMounted(() => {
      if (isEditing.value) {
        nextTick(focusLabelInput);
      }

      document.addEventListener("keydown", escapeListener);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("keydown", escapeListener);
    });

    function updateMenuItemStatus(status: EditableMenuItemType["status"]) {
      context.emit("menu-item:update-status", {
        itemId: props.menuItem.id,
        payload: { status },
      });
    }

    function addChild() {
      context.emit("menu-item:add-child", { itemId: props.menuItem.id });
    }

    function removeMenuItem() {
      context.emit("menu-item:remove", { itemId: props.menuItem.id });
    }

    function moveMenuItem(direction: "up" | "down") {
      context.emit("menu-item:move", { itemId: props.menuItem.id, direction });
    }

    function startEditing() {
      updateMenuItemStatus("EDITING");
    }

    function cancelEditing() {
      if (props.menuItem.status === "EDITING_NEW") {
        removeMenuItem();
      } else {
        itemDraft.value = { ...initialDraft.value };
        updateMenuItemStatus("IDLE");
      }
    }

    function submitEditing() {
      context.emit("menu-item:edit", {
        itemId: props.menuItem.id,
        payload: { ...itemDraft.value },
      });
      updateMenuItemStatus("IDLE");
    }

    const labelPrefix = computed(() => {
      return props.indexPath.map((itemIndex) => `${itemIndex + 1}.`).join("");
    });

    return {
      itemDraft,
      isEditing,
      labelPrefix,
      startEditing,
      addChild,
      moveMenuItem,
      submitEditing,
      removeMenuItem,
      cancelEditing,
    };
  },
});
</script>

<style scoped lang="scss">
.menu-item {
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 600px;

  &:not(:last-child) {
    margin-bottom: 0.7rem;
  }

  .link {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 1px;
  }

  .inner {
    display: flex;
    justify-content: space-between;
    padding: 1rem;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }

    .right {
      display: flex;
      align-items: flex-start;
      margin-left: 1rem;
    }
  }

  .item-form {
    border-top: 1px solid #ccc;

    fieldset {
      padding: 1rem 1rem 0 1rem;
      border: 0;
    }

    .form-bottom {
      padding: 1rem;

      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
