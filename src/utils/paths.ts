import { compile } from 'path-to-regexp';

import { MENU_ROUTE_PATHS } from '../constants/paths';

export function getMenuListUrl(): string {
  return MENU_ROUTE_PATHS.MENU_LIST;
}

export function getMenuFormUrl(params: { menuId: string }): string {
  return compile(MENU_ROUTE_PATHS.MENU_FORM)(params);
}

export function getMenuItemsUrl(params: { menuAlias: string }): string {
  return compile(MENU_ROUTE_PATHS.MENU_ITEMS)(params);
}

export function getMenuPageUrl(params: { menuAlias: string }): string {
  return compile(MENU_ROUTE_PATHS.MENU_PAGE)(params);
}
