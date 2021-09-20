import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";

Vue.use(Vuex);

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: "#app",
  render: h => h(App)
});
