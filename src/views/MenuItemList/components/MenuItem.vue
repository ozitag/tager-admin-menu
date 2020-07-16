<template>
  <div class="menu-item">
    <div class="inner">
      <div class="left">
        <div>
          {{ index + 1 }}. <b>{{ menuItem.label }}</b>
        </div>
        <em>{{ menuItem.link }}</em>
      </div>

      <div>
        <base-button
          v-if="!isEditing"
          variant="icon"
          title="Edit"
          @click="toggleEditing"
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
        >
          <svg-icon name="north" />
        </base-button>

        <base-button
          v-if="!isEditing"
          variant="icon"
          title="Move down"
          :disabled="index === 0"
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
          v-model="itemDraft.label"
          :name="menuItem.id + '_label'"
          label="Name"
          autofocus
        />
        <form-field
          v-model="itemDraft.link"
          :name="menuItem.id + '_link'"
          label="Link"
        />
        <form-field-checkbox
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
  },
  data(): {
    isEditing: boolean;
    itemDraft: { label: string; link: string; isNewTab: boolean };
  } {
    return {
      isEditing: false,
      itemDraft: {
        label: this.menuItem.label,
        link: this.menuItem.link,
        isNewTab: this.menuItem.isNewTab,
      },
    };
  },
  mounted() {
    document.addEventListener('keydown', this.escapeListener);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.escapeListener);
  },
  methods: {
    escapeListener(event: KeyboardEvent) {
      if (event.key === 'Escape' && this.isEditing) {
        this.cancelEditing();
      }
    },
    toggleEditing() {
      this.isEditing = !this.isEditing;
    },
    getInitialDraft() {
      return {
        label: this.menuItem.label,
        link: this.menuItem.link,
        isNewTab: this.menuItem.isNewTab,
      };
    },
    cancelEditing() {
      this.toggleEditing();
      this.itemDraft = this.getInitialDraft();
    },
    submitEditing() {
      this.$emit('menu-item:edit', {
        itemId: this.menuItem.id,
        payload: { ...this.itemDraft },
      });
      this.toggleEditing();
    },
    addChild() {
      this.$emit('menu-item:add-child', { itemId: this.menuItem.id });
    },
    removeMenuItem() {
      this.$emit('menu-item:remove', { itemId: this.menuItem.id });
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
