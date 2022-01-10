import Vue from "vue";
import Vuex from "vuex";
import store from "../store/index";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";

const backendURL = "http://localhost:8000/"


// https://stackoverflow.com/a/56365464
function getPanoptoUser(){
  // Random string
  const tempID = `d9a91394-${new Date().getTime()}`
  // create a script tag
  const script = document.createElement('script')
  script.id = tempID
  // place the code inside the script. later replace it with execution result.
  script.textContent = 
  `document.getElementById("${tempID}").textContent = JSON.stringify(Panopto.user)`
  // attach the script to page
  document.documentElement.appendChild(script)
  // collect Panopto User
  const result = document.getElementById(tempID).textContent
  // remove script from page
  script.remove()
  return JSON.parse(result)
}


// Check if we are logged in
// eslint-disable-next-line no-undef
window.PanoptoUser = getPanoptoUser()

// Get JWT
chrome.cookies.get({details: {
  name: "jwt-auth",
  url: "http://localhost:8000/auth/jwt"
}}).then(cookie => {
  // Found the JWT token! We can get details and launch the extention
  const token = {}
}).catch( e => {
  // No JWT token! We need to get the user to log in
  // TODO: LOGIN IMPLEMENTATION
})

const launchCrowdCaptions = (token) => {
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
    render: h => h(App)
  });
}