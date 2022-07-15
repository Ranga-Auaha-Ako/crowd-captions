import Vue from "vue";
// eslint-disable-next-line import/order
import vuetify from "./vuetify"; // path to vuetify export
import AsyncComputed from "vue-async-computed";
import vueDebounce from "vue-debounce";
import VuetifyDialog from "vuetify-dialog";
import "vuetify-dialog/dist/vuetify-dialog.css";
import axios from "axios";
import App from "./App.vue";

Vue.use(AsyncComputed);
Vue.use(vueDebounce);
Vue.use(VuetifyDialog, {
  context: { vuetify },
  toast: { timeout: 3000, position: "bottom-right" },
});

const launchCrowdCaptions = () => {
  Vue.prototype.$user = window.PanoptoUser;
  const backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";
  Vue.prototype.$backendHost = backendHost;
  Vue.prototype.$AuthFetch = axios.create({
    baseURL: `${backendHost}/api/`,
    // timeout: 1000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.PanoptoUser.token}`,
    },
    mode: "cors",
  });

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
