import { MenuItemType } from '../../typings/model';

export interface EditableMenuItemType extends MenuItemType {
  status: 'IDLE' | 'EDITING' | 'EDITING_NEW';
  children: Array<EditableMenuItemType>;
}
