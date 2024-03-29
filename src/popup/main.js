import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import App from "./App.vue";
import "@mdi/font/css/materialdesignicons.css";

const launchCrowdCaptions = () => {
  Vue.prototype.$user = window.PanoptoUser;

  /* eslint-disable no-new */
  new Vue({
    el: "#app",
    vuetify,
    render: (h) => h(App),
  });
};

chrome.runtime.sendMessage({ content: "getUser" }, (userData) => {
  window.PanoptoUser = userData;
  launchCrowdCaptions();
});
