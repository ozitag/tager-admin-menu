<template>
  <PageLayout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { type MenuItemType, PageLayout } from "@tager/admin-layout";
import { useI18n } from "@tager/admin-services";
import { SettingsIcon } from "@tager/admin-ui";

import { getMenuPageUrl } from "../utils/paths";

export default defineComponent({
  name: "App",
  components: { PageLayout },
  setup() {
    const i18n = useI18n();

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: "menu",
        text: i18n.t("menus:menu"),
        icon: SettingsIcon,
        children: [
          {
            text: "main_en",
            url: getMenuPageUrl({ menuAlias: "main_en" }),
          },
          {
            text: "main_ru",
            url: getMenuPageUrl({ menuAlias: "main_ru" }),
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
