import { createApp } from "vue";

import { configStore, i18n, i18nPlugin } from "@tager/admin-services";
import "@tager/admin-ui/css";
import "@tager/admin-layout/css";

import { createRouter } from "@tager/admin-layout";

import { applyTranslations } from "../locales/apply";
import { MENU_PAGE_ROUTE } from "../constants/routes";
import { OZITAG_CONFIG } from "../config";

import App from "./App.vue";
import { populateEnvironment } from "./env";

populateEnvironment();
configStore.setConfig(OZITAG_CONFIG);

const router = createRouter(
  {
    routes: [MENU_PAGE_ROUTE],
  },
  { useTitleSync: false }
);

const app = createApp(App);

app.use(router);
app.use(i18nPlugin);

applyTranslations();

i18n.init({ debug: true, lng: "ru" }).then(() => {
  app.mount("#app");
});
