<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { MenuItemType } from '@tager/admin-layout';

import { getMenuListUrl } from '../utils/paths';
import { useTranslation } from '@tager/admin-ui';

export default defineComponent({
  name: 'App',
  setup(props, context) {
    const { t } = useTranslation(context);

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'menu',
        text: t('menus:menu'),
        url: getMenuListUrl(),
        icon: 'settings',
      },
    ];

    return {
      t,
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
