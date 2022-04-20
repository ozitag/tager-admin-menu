import { request, type ResponseBody } from "@tager/admin-services";

import type { MenuItemType, MenuType } from "../typings/model";

export function getMenuByAlias(
  menuAlias: string
): Promise<ResponseBody<MenuType>> {
  return request.get({ path: `/admin/menus/${menuAlias}` });
}

export function updateMenuItemList(
  menuAlias: string,
  menuItemList: Array<MenuItemType>
): Promise<ResponseBody<{ success: boolean }>> {
  return request.put({
    path: `/admin/menus/${menuAlias}`,
    body: { items: menuItemList },
  });
}
