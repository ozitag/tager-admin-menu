import type { Nullable } from "@tager/admin-services";

export interface MenuType {
  readonly alias: string;
  readonly items: Array<MenuItemType>;
  readonly name: string;
  readonly supportsTree: boolean;
}

export interface MenuItemType {
  id: number;
  label: string;
  link: Nullable<string>;
  isNewTab: boolean;
  children: Array<MenuItemType>;
}
