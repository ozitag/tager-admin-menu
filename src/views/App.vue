<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { MenuItemType } from '@tager/admin-layout';

import { getMenuListUrl } from '../utils/paths';

export const MENU_SECTION_MENU_ITEM: MenuItemType = {
  id: 'menu',
  text: 'Menu',
  url: getMenuListUrl(),
  icon: 'settings',
};

export default Vue.extend({
  name: 'App',
  data(): { sidebarMenuList: Array<MenuItemType> } {
    return {
      sidebarMenuList: [MENU_SECTION_MENU_ITEM],
    };
  },
});
</script>

<style scoped lang="scss"></style>
