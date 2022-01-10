import Vue from "vue";
import Vuex from "vuex";
import vuetify from "@/plugins/vuetify";
import App from "./App.vue";
import store from "../store/index";

// eslint-disable-next-line no-unused-vars
const launchCrowdCaptions = () => {
  Vue.use(Vuex);
  Vue.prototype.$user = window.PanoptoUser;

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
    render: (h) => h(App),
  });
};

function getPanoptoUser() {
  chrome.runtime.sendMessage({ content: "getUser" }, (userData) => {
    window.PanoptoUser = userData;
    launchCrowdCaptions();
  });
}

// Check if we are logged in
// eslint-disable-next-line no-undef
window.PanoptoUser = getPanoptoUser();
