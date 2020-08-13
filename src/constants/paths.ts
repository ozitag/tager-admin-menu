export const MENU_ROUTE_PATHS = {
  MENU_LIST: '/menu',
  MENU_FORM: '/menu/:menuId',
  MENU_ITEMS: '/menu/:menuAlias/items',

  /** The same as MENU_ITEMS, but has short path for convenience */
  MENU_PAGE: '/menu/:menuAlias',
} as const;
