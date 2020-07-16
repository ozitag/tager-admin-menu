import { Nullable, FileType } from '@tager/admin-services';

export type MenuType = {
  id: number;
  alias: string;
  label: string;
};

export type MenuItemType = {
  id: number;
  label: string;
  link: Nullable<string>;
  isNewTab: boolean;
  children: Array<MenuItemType>;
};