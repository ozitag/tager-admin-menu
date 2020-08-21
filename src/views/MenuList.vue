<template>
  <page title="Menus">
    <base-table
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      enumerable
    >
      <template v-slot:cell(menu-elements)="{ row }">
        <base-button
          variant="outline-secondary"
          :href="getMenuItemsUrl({ menuAlias: row.alias })"
        >
          Menu Items
        </base-button>
      </template>
    </base-table>
  </page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { ColumnDefinition } from '@tager/admin-ui';
import { useResource } from '@tager/admin-services';

import { MenuType } from '../typings/model';
import { getMenuList } from '../services/requests';
import { getMenuItemsUrl } from '../utils/paths';

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
];

export default defineComponent({
  name: 'MenuList',
  setup(props, context) {
    const [
      fetchMenuList,
      { data: menuList, loading: isMenuListLoading, error },
    ] = useResource<Array<MenuType>>({
      fetchResource: getMenuList,
      initialValue: [],
      context,
      resourceName: 'Menu list',
    });

    onMounted(() => {
      fetchMenuList();
    });

    return {
      columnDefs: COLUMN_DEFS,
      rowData: menuList,
      isRowDataLoading: isMenuListLoading,
      errorMessage: error,
      getMenuItemsUrl,
    };
  },
});
</script>

<style scoped lang="scss"></style>
