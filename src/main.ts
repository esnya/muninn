import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');
