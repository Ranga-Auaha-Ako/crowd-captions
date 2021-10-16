import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // used string for object names due to working with json
    // (how it will be presented from db)
    Caption_file: [
      {
        id: 72456,
        position: 1,
        start: 0,
        captionSentenceData: "Cannot connect to the Crowd Caption servers, please try again later",
        edit: []
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
      const currentTime = time;
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
    likeCaption(state, alternative) {
      // unsure if the merging of mock data has broken this function
      state.currentCaption[alternative] += 1;
    },
    setCaptionIndex(state, i) {
      state.captionIndex = i;
      state.nextStart = state.Caption_file[i + 1].start;
    },
    async loadCaptions(state, url){
      function setCaptions (captionFile){
        state.Caption_file = captionFile;
        console.log(url);
      }
      await fetch(`http://localhost:8000/captions/${url}`, {
        method:'GET',
        mode:'cors'
      })
      .then(response => response.json())
      .then(data => (setCaptions(data)));
    }
  },
  actions: {},
  modules: {}
});
