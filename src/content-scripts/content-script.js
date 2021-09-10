import Vue from "vue";
import Vuex from "vuex";
import store from "../store/index";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";

Vue.use(Vuex);

// Create element to host our vue app
const appContainer = document.createElement("div");
appContainer.id = "crowdcaptions-app-interface";

// Inject into application to replace captions
document.getElementById("dockedCaption").replaceChildren(appContainer);

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: appContainer,
  store,
  render: h => h(App)
});
