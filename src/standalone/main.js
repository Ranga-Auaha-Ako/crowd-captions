import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import App from "./App.vue";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

const launchCrowdCaptions = () => {
  Vue.prototype.$user = window.PanoptoUser;
  Vue.prototype.$backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";

  /* eslint-disable no-new */
  new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    render: (h) => h(App),
  });
};

chrome.runtime.sendMessage({ content: "getUser" }, (userData) => {
  window.PanoptoUser = userData;
  launchCrowdCaptions();
});
