import { compile } from "path-to-regexp";

import { MENU_ROUTE_PATHS } from "../constants/paths";

export function getMenuPageUrl(params: { menuAlias: string }): string {
  return compile(MENU_ROUTE_PATHS.MENU_PAGE)(params);
}
