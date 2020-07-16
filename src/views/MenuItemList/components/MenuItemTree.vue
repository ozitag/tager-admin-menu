<script lang="ts">
import Vue, { VNode } from 'vue';
import { MenuItemType } from '../../../typings/model';

import MenuItem from './MenuItem.vue';

export default Vue.extend({
  name: 'MenuItemTree',
  functional: true,
  props: {
    menuItemList: {
      type: Array,
      required: true,
    },
  },
  render(createElement, context) {
    const menuItemList = context.props.menuItemList as Array<MenuItemType>;

    function renderList(itemList: Array<MenuItemType>): VNode {
      return createElement(
        'ul',
        { class: 'menu-item-list' },
        itemList.map((menuItem, index) => {
          return createElement('li', { class: 'menu-item-container' }, [
            createElement(MenuItem, {
              props: { menuItem, index, itemList },
              on: context.listeners,
            }),
            menuItem.children.length > 0 ? renderList(menuItem.children) : null,
          ]);
        })
      );
    }

    return renderList(menuItemList);
  },
});
</script>

<style scoped lang="scss">
.menu-item-list {
}

.menu-item-container {
  margin-bottom: 0.7rem;

  .menu-item-list {
    padding-left: 3rem;
  }
}
</style>
