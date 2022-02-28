import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";

export default new Vuex.Store({
  state: {
    // used string for object names due to working with json
    // (how it will be presented from db)
    Caption_file: [
      {
        id: 72456,
        start: 0,
        body: "Cannot connect to the Crowd Caption servers, please try again later",
        edits: []
      }
    ],
    captionIndex: 0,
    nextStart: 0
  },
  getters: {
    currentCaption(state) {
      return state.Caption_file[state.captionIndex];
    }
  },
  mutations: {
    setTime(state, time) {
      // Use local variables here to prevent needlessly updating state
      const currentTime = time * 1000;
      let { captionIndex } = state;

      function getNextStart(currentCaptionIndex) {
        // Get the "end time" of the current aption (aka the next caption start time)
        //  - Sanity check if on last caption, there is no next caption so nextStart is infinity
        if (currentCaptionIndex + 1 >= state.Caption_file.length) {
          return Number.MAX_SAFE_INTEGER;
        }
        return state.Caption_file[currentCaptionIndex + 1].start;
      }
      let nextStart = getNextStart(captionIndex);

      // Work forwards to find the next caption for our timestamp
      while (currentTime > nextStart) {
        captionIndex += 1;
        nextStart = getNextStart(captionIndex);
      }
      // Work backwards to find the caption for our timestamp
      while (currentTime < state.Caption_file[captionIndex].start) {
        if (captionIndex > 0) {
          captionIndex -= 1;
          nextStart = getNextStart(captionIndex);
        } else {
          // We have reached the first caption
          break;
        }
      }
      // Update state
      state.nextStart = nextStart;
      state.captionIndex = captionIndex;
    },
    async createEdit(state, edit) {
      const editObject = {
        sentenceId: state.Caption_file[state.captionIndex].id,
        body: edit.body,
        // eslint-disable-next-line no-undef,no-underscore-dangle
        upi: window.PanoptoUser.userData.upi
      };
      await fetch(`${backendHost}/api/edit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.PanoptoUser.token}`
        },
        mode: "cors",
        body: JSON.stringify(editObject)
      }).then(response => console.log(response));
    },
    async setVote(state, params) {
      const voteObject = {
        upvoted: (params.vote === "upvote").toString(),
        EditId: params.edit.id,
        // eslint-disable-next-line no-undef,no-underscore-dangle
        upi: window.PanoptoUser.userData.upi
      };
      await fetch(`${backendHost}/api/vote`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.PanoptoUser.token}`
        },
        mode: "cors",
        body: JSON.stringify(voteObject)
      }).then(response => console.log(response));
    },
    async setReport(state, params) {
      const reportObject = {
        upvoted: (params.vote === "upvote").toString(),
        EditId: params.edit.id,
        // eslint-disable-next-line no-undef,no-underscore-dangle
        upi: window.PanoptoUser.userData.upi
      };
      await fetch(`${backendHost}/api/report`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.PanoptoUser.token}`
        },
        mode: "cors",
        body: JSON.stringify(reportObject)
      }).then(response => console.log(response));
    },
    async loadEdits(state, id) {
      function loadEdits(edits) {
        Vue.set(state.Caption_file[state.captionIndex], "edits", edits);
      }
      // eslint-disable-next-line no-undef,no-underscore-dangle
      await fetch(`${backendHost}/api/edits/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${window.PanoptoUser.token}`
        },
        mode: "cors"
      })
        .then(response => response.json())
        .then(data => loadEdits(data));
    },
    setCaptionIndex(state, i) {
      state.captionIndex = i;
      state.nextStart = state.Caption_file[i + 1].start;
    },
    async loadCaptions(state, url) {
      function setCaptions(captionFile) {
        state.Caption_file = captionFile.Caption_file;
      }
      // eslint-disable-next-line no-undef,no-underscore-dangle
      await fetch(`${backendHost}/api/captions/${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${window.PanoptoUser.token}`
        },
        mode: "cors"
      })
        .then(response => response.json())
        .then(data => setCaptions(data));
    }
  },
  actions: {},
  modules: {}
});
