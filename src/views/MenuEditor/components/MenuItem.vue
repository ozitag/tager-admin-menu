<template>
  <div class="menu-item">
    <div class="inner">
      <div class="left">
        <div>
          {{ labelPrefix }} <b>{{ menuItem.label }}</b>
        </div>
        <em>{{ menuItem.link }}</em>
      </div>

      <div>
        <base-button
          v-if="!isEditing"
          variant="icon"
          title="Edit"
          @click="startEditing"
        >
          <svg-icon name="edit" />
        </base-button>

        <base-button
          v-if="!isEditing"
          variant="icon"
          title="Add child item"
          @click="addChild"
        >
          <svg-icon name="addCircle" />
        </base-button>

        <base-button
          v-if="!isEditing"
          variant="icon"
          title="Move up"
          :disabled="index === 0"
          @click="moveMenuItem('up')"
        >
          <svg-icon name="north" />
        </base-button>

        <base-button
          v-if="!isEditing"
          variant="icon"
          title="Move down"
          :disabled="index === itemList.length - 1"
          @click="moveMenuItem('down')"
        >
          <svg-icon name="south" />
        </base-button>

        <base-button variant="icon" title="Delete" @click="removeMenuItem">
          <svg-icon name="delete" />
        </base-button>
      </div>
    </div>

    <form
      v-if="isEditing"
      novalidate
      class="item-form"
      @submit.prevent="submitEditing"
    >
      <fieldset>
        <form-field
          :id="menuItem.id + '_label'"
          v-model="itemDraft.label"
          :name="menuItem.id + '_label'"
          label="Name"
          autofocus
        />
        <form-field
          :id="menuItem.id + '_link'"
          v-model="itemDraft.link"
          :name="menuItem.id + '_link'"
          label="Link"
        />
        <form-field-checkbox
          :id="menuItem.id + '_isNewTab'"
          v-model="itemDraft.isNewTab"
          :name="menuItem.id + '_isNewTab'"
          label="Is new tab?"
        />
      </fieldset>

      <div class="form-bottom">
        <base-button
          variant="secondary"
          title="Cancel changes"
          @click="cancelEditing"
        >
          Cancel
        </base-button>

        <base-button variant="primary" type="submit" title="Save changes">
          Save
        </base-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EditableMenuItemType } from '../MenuEditor.types';
import { Nullable } from '@tager/admin-services';

export default Vue.extend({
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    indexPath: {
      type: Array,
      required: true,
    },
    itemList: {
      type: Array,
      required: true,
    },
  },
  data(): {
    itemDraft: { label: string; link: string; isNewTab: boolean };
  } {
    return {
      itemDraft: {
        label: this.menuItem.label,
        link: this.menuItem.link,
        isNewTab: this.menuItem.isNewTab,
      },
    };
  },
  computed: {
    isEditing(): boolean {
      return this.menuItem.status === 'EDITING';
    },
    labelPrefix(): string {
      return (this.indexPath as Array<number>)
        .map((itemIndex) => `${itemIndex + 1}.`)
        .join('');
    },
  },
  watch: {
    isEditing(isEditing) {
      if (!isEditing) return;

      Vue.nextTick(this.focusLabelInput);
    },
  },
  mounted() {
    if (this.isEditing) {
      Vue.nextTick(this.focusLabelInput);
    }

    document.addEventListener('keydown', this.escapeListener);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.escapeListener);
  },
  methods: {
    focusLabelInput() {
      const inputElement = document.getElementById(
        this.menuItem.id + '_label'
      ) as Nullable<HTMLInputElement>;

      if (inputElement) {
        inputElement.focus();
      }
    },
    escapeListener(event: KeyboardEvent) {
      if (event.key === 'Escape' && this.isEditing) {
        this.cancelEditing();
      }
    },
    getInitialDraft() {
      return {
        label: this.menuItem.label,
        link: this.menuItem.link,
        isNewTab: this.menuItem.isNewTab,
      };
    },
    updateMenuItemStatus(status: EditableMenuItemType['status']) {
      this.$emit('menu-item:update-status', {
        itemId: this.menuItem.id,
        payload: { status },
      });
    },
    startEditing() {
      this.updateMenuItemStatus('EDITING');
    },
    cancelEditing() {
      this.itemDraft = this.getInitialDraft();
      this.updateMenuItemStatus('IDLE');
    },
    submitEditing() {
      this.$emit('menu-item:edit', {
        itemId: this.menuItem.id,
        payload: { ...this.itemDraft },
      });
      this.updateMenuItemStatus('IDLE');
    },
    addChild() {
      this.$emit('menu-item:add-child', { itemId: this.menuItem.id });
    },
    removeMenuItem() {
      this.$emit('menu-item:remove', { itemId: this.menuItem.id });
    },
    moveMenuItem(direction: 'up' | 'down') {
      this.$emit('menu-item:move', { itemId: this.menuItem.id, direction });
    },
  },
});
</script>

<style scoped lang="scss">
.menu-item {
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 600px;

  &:not(:last-child) {
    margin-bottom: 0.7rem;
  }

  .inner {
    display: flex;
    justify-content: space-between;
    padding: 1rem;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .item-form {
    border-top: 1px solid #ccc;

    fieldset {
      padding: 1rem 1rem 0 1rem;
      border: 0;
    }

    .form-bottom {
      padding: 1rem;

      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
