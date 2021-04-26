import { VueConstructor } from 'vue';
import { CustomRouteConfig } from '@tager/admin-layout';

import MenuEditorView from './views/MenuEditor';
import { MENU_ROUTE_PATHS } from './constants/paths';
import { i18n } from '@tager/admin-services';
import EN from './locales/en';
import RU from './locales/ru';

i18n.addTranslations('en', 'menus', EN);
i18n.addTranslations('ru', 'menus', RU);

export * from './constants/routes';
export * from './constants/paths';
export * from './utils/paths';

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
