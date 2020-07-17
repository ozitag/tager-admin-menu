import { CustomRouteConfig } from '@tager/admin-layout';

import MenuList from '../views/MenuList.vue';
import MenuItemList from '../views/MenuEditor/index.vue';
import MenuForm from '../views/MenuForm.vue';

import { MENU_ROUTE_PATHS } from './paths';

const HOME_BREADCRUMB = { path: '/', label: 'Home' };

export const MENU_LIST_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_LIST,
  component: MenuList,
  name: 'Menus',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: route.name },
    ],
  },
};

export const MENU_FORM_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_FORM,
  component: MenuForm,
  name: 'Menu form',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      {
        path: MENU_ROUTE_PATHS.MENU_LIST,
        label: MENU_LIST_ROUTE.name,
      },
      { path: route.path, label: route.name },
    ],
  },
};

export const MENU_ITEMS_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_ITEMS,
  component: MenuItemList,
  name: 'Menu items',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      {
        path: MENU_ROUTE_PATHS.MENU_LIST,
        label: MENU_LIST_ROUTE.name,
      },
      { path: route.path, label: route.name },
    ],
  },
};
