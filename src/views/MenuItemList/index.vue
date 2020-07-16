<template>
  <page
    :title="'Menu items'"
    :is-content-loading="isInitialLoading"
    :footer="{
      backHref: menuListRoutePath,
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <ul v-if="menuItemList.length > 0" class="menu-item-list">
      <li
        v-for="(menuItem, index) of menuItemList"
        :key="menuItem.id"
        class="menu-item-container"
      >
        <div class="menu-item">
          <div>
            {{ index + 1 }}. <b>{{ menuItem.label }}</b>
          </div>
          <em>{{ menuItem.link }}</em>
        </div>
        <ul v-if="menuItem.children.length > 0" class="menu-item-list">
          <li
            v-for="(childMenuItem, childIndex) of menuItem.children"
            :key="childMenuItem.id"
            class="menu-item-container"
          >
            <div class="menu-item">
              <div>
                {{ childIndex + 1 }}. <b>{{ childMenuItem.label }}</b>
              </div>
              <em>{{ childMenuItem.link }}</em>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <span v-else>No items found</span>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';

import { MENU_ROUTE_PATHS } from '../../constants/paths';
import { getMenuItemList } from '../../services/requests';
import { MenuItemType } from '../../typings/model';

export default Vue.extend({
  name: 'MenuItemList',
  data(): {
    menuItemList: Array<MenuItemType>;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isInitialLoading: boolean;
    menuListRoutePath: string;
  } {
    return {
      menuItemList: [],
      errors: {},
      isSubmitting: false,
      isInitialLoading: false,
      menuListRoutePath: MENU_ROUTE_PATHS.MENU_LIST,
    };
  },
  computed: {
    menuAlias(): string {
      return this.$route.params.menuAlias;
    },
  },
  mounted(): void {
    this.isInitialLoading = true;

    getMenuItemList(this.menuAlias)
      .then((response) => {
        this.menuItemList = response.data;
      })
      .catch(console.error)
      .finally(() => {
        this.isInitialLoading = false;
      });
  },
  methods: {
    submitForm() {
      this.isSubmitting = true;

      // updateSettingsItem(this.itemId, body)
      //   .then(() => {
      //     this.errors = {};
      //     this.$router.push(MENU_ROUTE_PATHS.MENU_LIST);
      //
      //     this.$toast({
      //       variant: 'success',
      //       title: 'Success',
      //       body: 'Settings have been successfully updated',
      //     });
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     this.errors = convertRequestErrorToMap(error);
      //     this.$toast({
      //       variant: 'danger',
      //       title: 'Error',
      //       body: 'Settings update have been failed',
      //     });
      //   })
      //   .finally(() => {
      //     this.isSubmitting = false;
      //   });
    },
  },
});
</script>

<style scoped lang="scss">
.menu-item-list {
}

.menu-item {
  width: 400px;

  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 1rem;

  &:not(:last-child) {
    margin-bottom: 0.7rem;
  }
}

.menu-item-container {
  margin-bottom: 0.7rem;

  .menu-item-list {
    padding-left: 3rem;
  }
}
</style>
