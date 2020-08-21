import { VueConstructor } from 'vue';
import { CustomRouteConfig } from '@tager/admin-layout';

import MenuEditorView from './views/MenuEditor';
import { MENU_ROUTE_PATHS } from './constants/paths';

export * from './constants/routes';
export * from './constants/paths';
export * from './utils/paths';

export { default as MenuList } from './views/MenuList.vue';
export { default as MenuForm } from './views/MenuForm.vue';

export const MenuEditor: VueConstructor<Vue> = MenuEditorView;

export function createMenuRoute(
  name: string,
  overrides?: Partial<CustomRouteConfig>
): CustomRouteConfig {
  return {
    name,
    path: MENU_ROUTE_PATHS.MENU_PAGE,
    component: MenuEditor,
    meta: {
      getBreadcrumbs: (route) => [
        { url: '/', text: 'Home' },
        { url: route.path, text: name },
      ],
    },
    ...overrides,
  };
}
