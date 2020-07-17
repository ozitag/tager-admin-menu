import { Nullable } from '@tager/admin-services';

export type MenuType = {
  id: number;
  alias: string;
  label: string;
};

export interface MenuItemType {
  id: number;
  label: string;
  link: Nullable<string>;
  isNewTab: boolean;
  children: Array<MenuItemType>;
}
