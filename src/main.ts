import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/superhero/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/all.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Vue from 'vue';
import Vuex from 'vuex';
import Toasted from 'vue-toasted';

import App from './App.vue';
import macros from './services/macros';
import pawns from './services/pawns';
import settings from './services/settings';

library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Toasted, { position: 'bottom-center', duration: 3000 });
export const store = new Vuex.Store({ modules: { macros, pawns, settings } });
export default new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
