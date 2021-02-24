<template>
  <page :title="t('menus:menus')">
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
          {{ t('menus:menuItems') }}
        </base-button>
      </template>
    </base-table>
  </page>
</template>

<script lang="ts">
import { defineComponent, onMounted, SetupContext } from '@vue/composition-api';
import { ColumnDefinition, useTranslation } from '@tager/admin-ui';
import { useResource } from '@tager/admin-services';

import { MenuType } from '../typings/model';
import { getMenuList } from '../services/requests';
import { getMenuItemsUrl } from '../utils/paths';

export default defineComponent({
  name: 'MenuList',
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

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

    const columnDefs: Array<ColumnDefinition<MenuType>> = [
      { id: 2, name: t('menus:alias'), field: 'alias' },
      { id: 3, name: t('menus:label'), field: 'label' },
      {
        id: 4,
        name: '',
        field: 'menuElements',
        style: { width: '170px', textAlign: 'center', whiteSpace: 'nowrap' },
        headStyle: { width: '170px' },
      },
    ];

    return {
      t,
      columnDefs,
      rowData: menuList,
      isRowDataLoading: isMenuListLoading,
      errorMessage: error,
      getMenuItemsUrl,
    };
  },
});
</script>

<style scoped lang="scss"></style>
