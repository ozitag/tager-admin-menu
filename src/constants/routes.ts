import { CustomRouteConfig } from '@tager/admin-layout';

import MenuPage from '../views/MenuEditor';

import { MENU_ROUTE_PATHS } from './paths';

export const MENU_PAGE_ROUTE: CustomRouteConfig = {
  path: MENU_ROUTE_PATHS.MENU_PAGE,
  component: MenuPage,
  name: 'Menu page',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('menus:home') },
      { url: route.path, text: t('menus:menuItems') },
    ],
  },
};
