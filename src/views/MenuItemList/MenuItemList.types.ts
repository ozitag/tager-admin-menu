import { MenuItemType } from '../../typings/model';

export interface EditableMenuItemType extends MenuItemType {
  status: 'IDLE' | 'EDITING';
  children: Array<EditableMenuItemType>;
}
