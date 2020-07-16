import { request, ResponseBody } from '@tager/admin-services';

import { MenuItemType, MenuType } from '../typings/model';

export function getMenuList(): Promise<ResponseBody<Array<MenuType>>> {
  return request.get({ path: '/menus' });
}

export function getMenu(
  menuId: number | string
): Promise<ResponseBody<MenuType>> {
  return request.get({ path: `/menus/${menuId}` });
}

export type MenuUpdatePayload = Pick<MenuType, 'alias' | 'label'>;

export function createMenu(
  payload: MenuUpdatePayload
): Promise<ResponseBody<MenuType>> {
  return request.post({ path: '/menus', body: payload });
}

export function updateMenu(
  menuId: number | string,
  payload: MenuUpdatePayload
): Promise<ResponseBody<MenuType>> {
  return request.put({ path: `/menus/${menuId}`, body: payload });
}

export function deleteMenu(
  menuId: number | string
): Promise<{ success: boolean }> {
  return request.delete({ path: `/menus/${menuId}` });
}

export function getMenuItemList(
  menuAlias: string
): Promise<ResponseBody<Array<MenuItemType>>> {
  return request.get({ path: `/menus/${menuAlias}/items` });
}

export function updateMenuItemList(
  menuAlias: string,
  menuItemList: Array<MenuItemType>
): Promise<ResponseBody<Array<MenuItemType>>> {
  return request.put({
    path: `/menus/${menuAlias}/items`,
    body: { items: menuItemList },
  });
}
