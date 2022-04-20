import type { RouteRecordRaw } from "vue-router";

import MenuPage from "../views/MenuEditor";

import { MENU_ROUTE_PATHS } from "./paths";

export const MENU_PAGE_ROUTE: RouteRecordRaw = {
  path: MENU_ROUTE_PATHS.MENU_PAGE,
  component: MenuPage,
  name: "Menu page",
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: "/", text: i18n.t("menus:home") },
      { url: route.path, text: i18n.t("menus:menuItems") },
    ],
  },
};
