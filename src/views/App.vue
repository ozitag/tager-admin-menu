<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { MenuItemType } from '@tager/admin-layout';

import { useTranslation } from '@tager/admin-ui';
import { getMenuPageUrl } from '../utils/paths';

export default defineComponent({
  name: 'App',
  setup(props, context) {
    const { t } = useTranslation(context);

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'menu',
        text: t('menus:menu'),
        icon: 'settings',
        children: [
          {
            text: t('menus:headerMenu'),
            url: getMenuPageUrl({ menuAlias: 'header' }),
          },
          {
            text: t('menus:mainMenu'),
            url: getMenuPageUrl({ menuAlias: 'main' }),
          },
          {
            text: t('menus:footerMenu'),
            url: getMenuPageUrl({ menuAlias: 'footer' }),
          },
        ],
      },
    ];

    return {
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
