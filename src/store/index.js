import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentTime: 0,
    // used string for object names due to working with json
    // (how it will be presented from db)
    caption_file: [
      {
        id: 72456,
        position: 1,
        start: 0,
        body: "redefine Louisiana transmitter",
        edit: [
          {
            approved: true,
            id: 76579,
            body: "technologies Handmade",
            votes: 37,
            voted: 0,
            timestamp: "Sun Dec 13 2020 12:58:09 GMT+1300 (New Zealand Daylight Time)",
            reports: 0,
            reported: false
          },
          {
            approved: false,
            id: 88686,
            body: "Global Account",
            votes: -2,
            voted: -1,
            timestamp: "Fri Jul 09 2021 19:00:56 GMT+1200 (New Zealand Standard Time)",
            reports: 3,
            reported: true
          },
          {
            approved: false,
            id: 97331,
            body: "Loan next-generation",
            votes: 20,
            voted: 1,
            timestamp: "Fri Dec 25 2020 21:25:45 GMT+1300 (New Zealand Daylight Time)",
            reports: 1,
            reported: false
          },
          {
            approved: false,
            id: 65054,
            body: "up leverage",
            votes: 12,
            voted: 0,
            timestamp: "Thu Jan 21 2021 11:49:29 GMT+1300 (New Zealand Daylight Time)",
            reports: 0,
            reported: false
          }
        ]
      },
      {
        id: 13586,
        position: 2,
        start: 10,
        body: "directional Response Sterling",
        edit: []
      },
      {
        id: 44230,
        position: 3,
        start: 22,
        body: "Granite Mobility",
        edit: [
          {
            approved: false,
            id: 6625,
            body: "Plains",
            votes: 3,
            voted: 1,
            timestamp: "Thu Jul 01 2021 01:44:18 GMT+1200 (New Zealand Standard Time)",
            reports: 0,
            reported: false
          },
          {
            approved: false,
            id: 76306,
            body: "Loan",
            votes: 0,
            voted: 0,
            timestamp: "Tue Aug 17 2021 09:22:04 GMT+1200 (New Zealand Standard Time)",
            reports: 1,
            reported: true
          }
        ]
      },
      {
        id: 60722,
        position: 4,
        start: 30,
        body: "Auto Forint",
        edit: []
      },
      {
        id: 44215,
        position: 5,
        start: 38,
        body: "Soft Profound Pants",
        edit: []
      },
      {
        id: 93904,
        position: 6,
        start: 46,
        body: "inventore qui quibusdam",
        edit: []
      },
      {
        id: 95898,
        position: 7,
        start: 54,
        body: "Investor Awesome Ferry",
        edit: []
      },
      {
        id: 48458,
        position: 8,
        start: 60,
        body: "gold",
        edit: [
          {
            approved: true,
            id: 61551,
            body: "connect payment PNG",
            votes: 6,
            voted: 0,
            timestamp: "Tue Mar 23 2021 12:32:03 GMT+1300 (New Zealand Daylight Time)",
            reports: 0,
            reported: false
          }
        ]
      },
      {
        id: 22143,
        position: 9,
        start: 68,
        body: "productivity interactive",
        edit: []
      }
    ],
    captionIndex: 0,
    nextStart: 0,
  },
  getters: {
    currentCaption(state) {
      console.log(state.caption_file[state.captionIndex]);
      return state.caption_file[state.captionIndex];
    }
  },
  mutations: {
    setTime(state, time){
      state.currentTime = time;
      if (state.captionIndex + 1 < state.caption_file.length){
        state.nextStart = state.caption_file[state.captionIndex+1].start;
        console.log(state.captionIndex, state.caption_file.length);
      }
      while (state.currentTime > state.nextStart){
        if (state.captionIndex + 1< state.caption_file.length){
          state.captionIndex += 1
          state.nextStart = state.caption_file[state.captionIndex+1].start;
        } else {
          break;
        }
      }
      while (state.currentTime < state.caption_file[state.captionIndex].start){
        if (state.captionIndex > 0){
          state.nextStart = state.caption_file[state.captionIndex].start;
          state.captionIndex -= 1
          console.log("Decrease");
        } else {
          break;
        }
      }
    },
    likeCaption(state, alternative) {
      // unsure if the merging of mock data has broken this function
      state.currentCaption[alternative] += 1;
    },
    setCaptionIndex(state, i) {
      state.captionIndex = i;
      state.nextStart = state.caption_file[i+1].start;
    }
  },
  actions: {},
  modules: {}
});
