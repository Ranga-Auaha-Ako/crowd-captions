import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    captionTexts: [
      {
        start: 0,
        edits: [
          // Text: content of caption
          // Votes: # Votes total (not including user vote!)
          // userVote: one of [-1, 0, 1] depending on up/downvote status
          { text: "Hello, this is alt 1!", votes: 0, userVote: 0 },
          { text: "Hello, this is alt 2!", votes: 0, userVote: 0 },
          { text: "Hello, this is alt 3!", votes: 0, userVote: 0 },
          { text: "Hello, this is alt 4!", votes: 0, userVote: 0 }
        ]
      },
      {
        start: 10,
        edits: [
          { text: "Another one: 1", votes: 0, userVote: 0 },
          { text: "Another one: 2", votes: 0, userVote: 0 },
          { text: "Another one: 3", votes: 0, userVote: 0 },
          { text: "Another one: 4", votes: 0, userVote: 0 }
        ]
      }
    ]
  },
  getters: {
    currentCaption(state) {
      return state.captionTexts[0];
    }
  },
  mutations: {
    likeCaption(state, alternative) {
      state.currentCaption[alternative] += 1;
    }
  },
  actions: {},
  modules: {}
});
