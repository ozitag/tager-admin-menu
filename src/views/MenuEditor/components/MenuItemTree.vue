<script lang="ts">
import Vue, { VNode } from 'vue';

import MenuItem from './MenuItem.vue';
import { EditableMenuItemType } from '../MenuEditor.types';

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
    const menuItemList = context.props.menuItemList as Array<
      EditableMenuItemType
    >;

    function renderList(
      itemList: Array<EditableMenuItemType>,
      indexPath: Array<number>
    ): VNode {
      return createElement(
        'ul',
        { class: 'menu-item-list' },
        itemList.map((menuItem, index) => {
          const itemIndexPath = [...indexPath, index];

          return createElement('li', { class: 'menu-item-container' }, [
            createElement(MenuItem, {
              props: {
                menuItem,
                index,
                itemList,
                indexPath: itemIndexPath,
              },
              on: context.listeners,
            }),
            menuItem.children.length > 0
              ? renderList(menuItem.children, itemIndexPath)
              : null,
          ]);
        })
      );
    }

    return renderList(menuItemList, []);
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
