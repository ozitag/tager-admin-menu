<template>
  <page
    :title="'Menu items'"
    :is-content-loading="isInitialLoading"
    :footer="{
      backHref: settingsItemListRoutePath,
      backLabel: 'Back to Common settings',
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <form novalidate @submit.prevent>
      <!--      <component-->
      <!--        :is="valueFieldType"-->
      <!--        v-if="settingsItem"-->
      <!--        v-model="values.value"-->
      <!--        name="value"-->
      <!--        label="Value"-->
      <!--        :error="errors.value"-->
      <!--        v-bind="valueFieldAttrs"-->
      <!--      />-->
    </form>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';

import { MENU_ROUTE_PATHS } from '../constants/paths';

type FormValues = {};

export default Vue.extend({
  name: 'SettingsItemForm',
  data(): {
    values: FormValues;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isInitialLoading: boolean;
    settingsItemListRoutePath: string;
  } {
    return {
      values: {},
      errors: {},
      isSubmitting: false,
      isInitialLoading: false,
      settingsItemListRoutePath: MENU_ROUTE_PATHS.MENU_LIST,
    };
  },
  computed: {
    itemId(): string {
      return this.$route.params.itemId;
    },
  },
  mounted(): void {
    // this.isInitialLoading = true;
    // getSettingsItem(this.itemId)
    //   .then((response) => {
    //     this.values = this.convertSettingsItemToFormValues(response.data);
    //     this.settingsItem = response.data;
    //   })
    //   .catch(console.error)
    //   .finally(() => {
    //     this.isInitialLoading = false;
    //   });
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

<style scoped lang="scss"></style>
