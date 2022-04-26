import Vue from "vue";
import Vuex from "vuex";
import vuetify from "@/plugins/vuetify";
import App from "./App.vue";
import store from "../store/index";

const backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";

// eslint-disable-next-line no-unused-vars
const launchCrowdCaptions = async () => {
  // Fetch initial session data and determine if we need to launch Crowd Captions
  const sessionID = window.location.href.match(
    /(?:.+&|\?)id=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
  )[1];
  const captions = await fetch(`${backendHost}/api/captions/${sessionID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${window.PanoptoUser.token}`,
    },
    mode: "cors",
  }).then((response) => response.json());
  if (captions.error || !captions.Caption_file || captions.Caption_file.length === 0) {
    console.error(`Error loading captions: ${captions.error || "No error given"}`);
    // Disable Crowd Captions for this video
    //  - Delete injected styles
    document.querySelectorAll("style[data-vue-ssr-id]").forEach((e) => e.remove());
    //  - Return without initializing Vue
    return;
  }
  console.log("Found Crowd Captions, loading caption player");

  // Launch Crowd Captions
  Vue.use(Vuex);
  Vue.prototype.$user = window.PanoptoUser;
  Vue.prototype.$captionData = captions;

  // Create element to host our vue app
  const appContainer = document.createElement("div");
  appContainer.id = "crowdcaptions-app-interface";

  // Inject into application to replace captions
  document.getElementById("dockedCaption").appendChild(appContainer);

  /* eslint-disable no-new */
  window.CrowdCaptions = new Vue({
    vuetify,
    el: appContainer,
    store,
    render: (h) => h(App),
  });

  // Listener for exporting captions
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.content === "exportCaptions") {
      // Export the captions!
      console.log("2: Exporting captions...");
      window.CrowdCaptions.$root.$emit("exportCaptions", true);
      sendResponse({ result: "success" });
    }
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
