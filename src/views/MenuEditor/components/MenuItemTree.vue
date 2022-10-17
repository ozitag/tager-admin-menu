<template>
  <ul class="menu-item-list">
    <li
      v-for="(menuItem, index) of menuItemList"
      :key="menuItem.id"
      class="menu-item-container"
    >
      <MenuItem
        v-bind="$attrs"
        :menu-item="menuItem"
        :index="index"
        :item-list="menuItemList"
        :is-supports-tree="isSupportsTree"
        :index-path="[...indexPath, index]"
      />
      <MenuItemTree
        v-if="menuItem.children.length > 0"
        v-bind="$attrs"
        :is-supports-tree="isSupportsTree"
        :menu-item-list="menuItem.children"
        :index-path="[...indexPath, index]"
      />
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";

import type { EditableMenuItemType } from "../MenuEditor.types";

import MenuItem from "./MenuItem.vue";

export default defineComponent({
  name: "MenuItemTree",
  components: { MenuItem },
  props: {
    menuItemList: {
      type: Array as () => Array<EditableMenuItemType>,
      required: true,
    },
    isSupportsTree: {
      type: Boolean,
      default: false,
    },
    indexPath: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  },
});
</script>

<style scoped lang="scss">
.menu-item-list {
}

.menu-item-container {
  margin-bottom: 0.7rem;

  .menu-item-list {
    padding-left: 3rem;
  }
}
</style>
