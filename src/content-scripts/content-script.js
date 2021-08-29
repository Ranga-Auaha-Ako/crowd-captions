import Vue from 'vue';
import App from './App.vue';

console.log('Hello from the content-script');

const appContainer = document.createElement('div');
appContainer.id = 'crowdcaptions-app-interface';
document.getElementById('eventTabControl').appendChild(appContainer);

/* eslint-disable no-new */
new Vue({
  el: appContainer,
  render: (h) => h(App),
});
