<template>
  <page
    title="Menus"
    :header-buttons="[{ text: 'Create menu', href: getMenuHref('create') }]"
  >
    <base-table
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      enumerable
    >
      <template v-slot:cell(menu-elements)="{ row }">
        <base-button
          variant="outline-secondary"
          :href="getMenuItemsHref(row.alias)"
          :disabled="deletingMenuIdList.includes(row.id)"
        >
          Menu Items
        </base-button>
      </template>

      <template v-slot:cell(actions)="{ row }">
        <base-button
          variant="icon"
          title="Edit"
          :href="getMenuHref(row.id)"
          :disabled="deletingMenuIdList.includes(row.id)"
        >
          <svg-icon name="edit"></svg-icon>
        </base-button>

        <base-button
          variant="icon"
          title="Delete"
          :disabled="deletingMenuIdList.includes(row.id)"
          @click="deleteMenu(row)"
        >
          <svg-icon name="delete"></svg-icon>
        </base-button>
      </template>
    </base-table>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ColumnDefinition } from '@tager/admin-ui';
import { getMessageFromError, Nullable } from '@tager/admin-services';

import { MenuType } from '../typings/model';
import { deleteMenu, getMenuList } from '../services/requests';
import { getMenuFormUrl, getMenuItemsUrl } from '../utils/paths';

const COLUMN_DEFS: Array<ColumnDefinition<MenuType>> = [
  { id: 2, name: 'Alias', field: 'alias' },
  { id: 3, name: 'Label', field: 'label' },
  {
    id: 4,
    name: '',
    field: 'menuElements',
    style: { width: '170px', textAlign: 'center', whiteSpace: 'nowrap' },
    headStyle: { width: '170px' },
  },
  {
    id: 5,
    name: 'Actions',
    field: 'actions',
    style: { width: '110px', whiteSpace: 'nowrap', textAlign: 'center' },
    headStyle: { width: '110px' },
  },
];

export default Vue.extend({
  name: 'MenuList',
  data(): {
    columnDefs: Array<ColumnDefinition<MenuType>>;
    rowData: Array<MenuType>;
    isRowDataLoading: boolean;
    deletingMenuIdList: Array<number>;
    errorMessage: Nullable<string>;
  } {
    return {
      columnDefs: COLUMN_DEFS,
      rowData: [],
      isRowDataLoading: false,
      deletingMenuIdList: [],
      errorMessage: null,
    };
  },
  mounted(): void {
    this.refreshMenuList();
  },
  methods: {
    refreshMenuList(): Promise<void> {
      this.isRowDataLoading = true;

      return getMenuList()
        .then((response) => {
          this.rowData = response.data;
          this.errorMessage = null;
        })
        .catch((error) => {
          this.errorMessage = getMessageFromError(error);
        })
        .finally(() => {
          this.isRowDataLoading = false;
        });
    },
    getMenuHref(menuId: string): string {
      return getMenuFormUrl({ menuId });
    },
    getMenuItemsHref(menuAlias: string): string {
      return getMenuItemsUrl({ menuAlias });
    },
    deleteMenu(menu: MenuType) {
      const shouldDelete = confirm(
        `Are you sure you want to delete menu "${menu.label}"`
      );

      if (!shouldDelete) return;

      this.deletingMenuIdList.push(menu.id);

      deleteMenu(menu.id)
        .then((response) => {
          if (response.success) {
            this.$toast({
              variant: 'success',
              title: 'Success',
              body: 'Menu was successfully removed',
            });
          } else {
            this.$toast({
              variant: 'danger',
              title: 'Error',
              body: 'Menu deletion was failed',
            });
          }

          return this.refreshMenuList();
        })
        .catch((error) => {
          console.error(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Preset deletion was failed',
          });
        })
        .finally(() => {
          this.deletingMenuIdList = this.deletingMenuIdList.filter(
            (id) => id !== menu.id
          );
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
