import Vue from 'vue';
import vuetify from "@/plugins/vuetify";
import App from './App.vue';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify,
  render: (h) => h(App),
});
