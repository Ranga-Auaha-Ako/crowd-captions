import Vue from "vue";
import Vuex from "vuex";
import store from "../store/index";
import App from "./App.vue";

Vue.use(Vuex);

// Create element to host our vue app
const appContainer = document.createElement("div");
appContainer.id = "crowdcaptions-app-interface";

// Inject into application to replace captions
document.getElementById("dockedCaption").replaceChildren(appContainer);

/* eslint-disable no-new */
new Vue({
  el: appContainer,
  store,
  render: h => h(App)
});
