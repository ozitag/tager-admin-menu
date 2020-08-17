import { Nullable } from '@tager/admin-services';

import { MenuItemType } from '../../typings/model';

import { EditableMenuItemType } from './MenuEditor.types';

export function getItemCount(itemList: Array<EditableMenuItemType>): number {
  let sum = 0;

  for (const item of itemList) {
    sum += 1;
    sum += getItemCount(item.children);
  }

  return sum;
}

export function findMenuItemById(
  itemList: Array<EditableMenuItemType>,
  itemId: number
): Nullable<EditableMenuItemType> {
  for (const item of itemList) {
    if (item.id === itemId) return item;

    const foundItem = findMenuItemById(item.children, itemId);
    if (foundItem) return foundItem;
  }

  return null;
}

export function findArrayContainingMenuItemWithId(
  itemList: Array<EditableMenuItemType>,
  itemId: number
): Nullable<Array<EditableMenuItemType>> {
  for (const item of itemList) {
    if (item.id === itemId) return itemList;

    const foundItemList = findArrayContainingMenuItemWithId(
      item.children,
      itemId
    );
    if (foundItemList) return foundItemList;
  }

  return null;
}

export function removeMenuItemById(
  itemList: Array<EditableMenuItemType>,
  itemId: number
): void {
  for (let i = 0; i < itemList.length; i++) {
    const currentItem = itemList[i];

    if (currentItem.id === itemId) {
      itemList.splice(i, 1);
      return;
    }

    if (currentItem.children.length > 0) {
      removeMenuItemById(currentItem.children, itemId);
    }
  }
}

export function moveMenuItemById(
  itemList: Array<EditableMenuItemType>,
  itemId: number,
  direction: 'up' | 'down'
): void {
  const itemIndex = itemList.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) return;

  if (
    (direction === 'up' && itemIndex === 0) ||
    (direction === 'down' && itemIndex === itemList.length - 1)
  ) {
    return;
  }

  const item = itemList[itemIndex];

  itemList.splice(itemIndex, 1);
  itemList.splice(direction === 'up' ? itemIndex - 1 : itemIndex + 1, 0, item);
}

export function convertToEditableMenuItems(
  menuItemList: Array<MenuItemType>
): Array<EditableMenuItemType> {
  return menuItemList.map((item) => ({
    ...item,
    status: 'IDLE',
    children: convertToEditableMenuItems(item.children),
  }));
}
