<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { MenuItemType } from '@tager/admin-layout';

import { MENU_ROUTE_PATHS } from '../constants/paths';

export const MENU_SECTION_MENU_ITEM: MenuItemType = {
  id: 'menu',
  name: 'Menu',
  path: MENU_ROUTE_PATHS.MENU_LIST,
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
