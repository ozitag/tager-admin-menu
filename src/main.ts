import MenuEditorView from './views/MenuEditor/index.vue';
import { CustomRouteConfig } from '@tager/admin-layout';
import { VueConstructor } from 'vue';

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
    path: '/menu/:menuAlias',
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
