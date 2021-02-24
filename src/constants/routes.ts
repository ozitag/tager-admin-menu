import { CustomRouteConfig } from '@tager/admin-layout';

import MenuList from '../views/MenuList.vue';
import MenuEditor from '../views/MenuEditor';
import MenuForm from '../views/MenuForm.vue';

import { MENU_ROUTE_PATHS } from './paths';
import { getMenuListUrl } from '../utils/paths';

export const MENU_LIST_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_LIST,
  component: MenuList,
  name: 'Menus',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('menus:home') },
      { url: route.path, text: t('menus:menus') },
    ],
  },
};

export const MENU_FORM_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_FORM,
  component: MenuForm,
  name: 'Menu form',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('menus:home') },
      {
        url: getMenuListUrl(),
        text: t('menus:menus'),
      },
      { url: route.path, text: t('menus:menuForm') },
    ],
  },
};

export const MENU_ITEMS_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_ITEMS,
  component: MenuEditor,
  name: 'Menu items',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('menus:home') },
      {
        url: getMenuListUrl(),
        text: t('menus:menus'),
      },
      { url: route.path, text: t('menus:menuItems') },
    ],
  },
};
