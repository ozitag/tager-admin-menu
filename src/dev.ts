import Vue, { CreateElement } from 'vue';
import VueCompositionApi, { createApp } from '@vue/composition-api';
import { configStore, i18n } from '@tager/admin-services';
import { AdminUiPlugin } from '@tager/admin-ui';
import { AdminLayoutPlugin, createRouter } from '@tager/admin-layout';

import '@tager/admin-ui/dist/admin-ui.css';

import { MENU_PAGE_ROUTE } from './constants/routes';
import config from './config/config.json';
import App from './views/App.vue';
import EN from './locales/en';
import RU from './locales/ru';

configStore.setConfig(config);

Vue.use(AdminUiPlugin);
Vue.use(AdminLayoutPlugin);

const router = createRouter(
  {
    routes: [MENU_PAGE_ROUTE],
  },
  { useTitleSync: false }
);

Vue.use(VueCompositionApi);

i18n.addTranslations('en', 'menus', EN);
i18n.addTranslations('ru', 'menus', RU);

i18n.init({ debug: false, lng: 'ru' }).then(() => {
  const app = createApp({
    router,
    render: (h: CreateElement) => h(App),
  });

  app.use(i18n.getPlugin());
  app.use(AdminUiPlugin);
  app.use(AdminLayoutPlugin);

  app.mount('#app');
});
