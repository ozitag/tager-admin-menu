import { CustomRouteConfig } from '@tager/admin-layout';

import MenuList from '../views/MenuList.vue';
import MenuEditor from '../views/MenuEditor/index.vue';
import MenuForm from '../views/MenuForm.vue';

import { MENU_ROUTE_PATHS } from './paths';
import { getMenuListUrl } from '../utils/paths';

const HOME_BREADCRUMB = { url: '/', text: 'Home' };

export const MENU_LIST_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_LIST,
  component: MenuList,
  name: 'Menus',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { url: route.path, text: route.name ?? '' },
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
        url: getMenuListUrl(),
        text: MENU_LIST_ROUTE.name ?? '',
      },
      { url: route.path, text: route.name ?? '' },
    ],
  },
};

export const MENU_ITEMS_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_ITEMS,
  component: MenuEditor,
  name: 'Menu items',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      {
        url: getMenuListUrl(),
        text: MENU_LIST_ROUTE.name ?? '',
      },
      { url: route.path, text: route.name ?? '' },
    ],
  },
};
