import Vue from "vue";
import Vuex from "vuex";
import vuetify from "@/plugins/vuetify";
import App from "./App.vue";
import store from "../store/index";

const backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";

const loadUIAdditions = () => {
  const captionsButtonInsertion = `<div style="display: grid; column-gap: 0.5rem; grid-template-columns: 1fr 1fr; margin-bottom: 0.5rem;">
    <a href="javascript:;" id="CrowdCaptions-showPopup" class="standard-button branded-button" role="button" tabindex="0" style="justify-content: center; column-gap: 0.5rem; display: flex; font-size: 0.9em;">
      <i class="material-icons button-icon-left">closed_captions</i>
      <div>Crowd Captions</div>
    </a>
    <a href="javascript:;" id="CrowdCaptions-exportCaptions" class="standard-button branded-button" role="button" tabindex="0" style="justify-content: center; column-gap: 0.5rem; display: flex; font-size: 0.9em;">
      <i class="material-icons button-icon-left">file_download</i>
      <div>Export Captions</div>
    </a>
  </div>
  <p style="padding: 0.5rem; background: #f0f0f0; border-radius: 3px; font-style: italic;">
    Note: The captions below are as presented in the original transcription, and
    do not include Crowd Captions edits
  </p>`;
  document.getElementById("transcriptPaneHeader").innerHTML += captionsButtonInsertion;

  const iconAddition = `<i class="material-icons text" style="font-size: 1.1em;vertical-align: middle;">closed_captions</i>`;
  document.getElementById("transcriptTabHeader").innerHTML =
    iconAddition + document.getElementById("transcriptTabHeader").innerHTML;

  document.getElementById("CrowdCaptions-exportCaptions").addEventListener(
    "click",
    () => {
      window.CrowdCaptions.$root.$emit("exportCaptions", true);
    },
    false
  );
  document.getElementById("CrowdCaptions-showPopup").addEventListener(
    "click",
    () => {
      chrome.runtime.sendMessage({ content: "showPopup" });
    },
    false
  );
};

// window.exportCaptions = () => {};

// window.showPopup = () => {};

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
    if (process.env.NODE_ENV === "development") {
      document.querySelectorAll("style[data-vue-ssr-id]").forEach((e) => e.remove());
      document.querySelectorAll("style[data-vue-ssr-id]").forEach((e) => e.remove());
    } else {
      document.querySelectorAll("style#crowd-captions-css").forEach((e) => e.remove());
      document.querySelectorAll("style#vuetify-theme-stylesheet").forEach((e) => e.remove());
    }
    //  - Return without initializing Vue
    return;
  }
  console.log("Found Crowd Captions, loading caption player");

  // Embed CSS
  if (process.env.NODE_ENV !== "development") {
    chrome.runtime.sendMessage({ content: "getCSS" }, ({ url }) => {
      const link = document.createElement("link");
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.id = "crowd-captions-css";
      document.getElementsByTagName("head")[0].appendChild(link);
    });
  }

  // Launch Crowd Captions
  Vue.use(Vuex);
  Vue.prototype.$user = window.PanoptoUser;
  Vue.prototype.$captionData = captions;

  // Create element to host our vue app
  const appContainer = document.createElement("div");
  appContainer.id = "crowdcaptions-app-interface";

  // Inject into application to replace captions
  document.getElementById("dockedCaption").appendChild(appContainer);

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

  // Load UI additions
  loadUIAdditions();
};

window.getPanoptoUser = () => {
  const user = new Promise((resolve) => {
    chrome.runtime.sendMessage({ content: "getUser" }, (userData) => {
      resolve(userData);
    });
  });
  return user;
};

// Check if we are logged in
// eslint-disable-next-line no-undef
const initialLoad = async () => {
  window.PanoptoUser = await window.getPanoptoUser();
  launchCrowdCaptions();
};
initialLoad();
