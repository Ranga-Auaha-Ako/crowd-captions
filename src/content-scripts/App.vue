<template>
  <v-app
    id="crowdcaptions-app"
    v-click-outside="
      () => {
        showEdits = false;
      }
    "
  >
    <div class="crowdcaptions-container" :class="{ showEdits }">
      <div>
        <v-row id="closeButton" no-gutters align="center">
          <v-col>
            <v-btn @click="showEdits = false">Close</v-btn>
          </v-col>
        </v-row>
        <div v-for="(edit, index) in visibleEdits" :key="edit.id">
          <CaptionAlt
            :edit="edit"
            :index="index"
            @show-edits="toggleEdits()"
            :open="showEdits"
            @save-caption="saveCaption"
          />
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" color="light-green darken-4">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import CaptionAlt from "../components/CaptionAlt.vue";

export default {
  name: "App",
  components: {
    CaptionAlt
  },
  data() {
    return {
      showEdits: false,
      maxAlternatives: 3,
      primaryVideo: null,
      snackbar: {
        show: false,
        text: "",
        timeout: 2000
      }
    };
  },
  mounted() {
    setTimeout(() => {
      // eslint-disable-next-line func-names
      document.getElementById("primaryVideo").ontimeupdate = this.setTime;
    }, 3000);
  },
  computed: {
    currentCaption() {
      return this.$store.getters.currentCaption;
    },
    visibleEdits() {
      // Append default caption as fake "edit" to end of list of all captions
      const allCaptions = this.currentCaption.edit.slice();
      allCaptions.push({
        body: this.currentCaption.body,
        id: -1,
        votes: 0,
        voted: 0,
        reported: false
      });
      console.log("XXXXXXXXXXXXXXX");
      console.log(allCaptions[0]);
      if (this.showEdits) {
        // Show all edits, with a limit
        return allCaptions.length > this.maxAlternatives
          ? allCaptions.slice(0, this.maxAlternatives)
          : allCaptions;
      }
      // Only show most liked
      return [allCaptions[0]];
    }
  },
  methods: {
    toggleEdits() {
      this.showEdits = !this.showEdits;
    },
    saveCaption(edit) {
      this.snackbar.show = true;
      this.snackbar.text = `Submitted Caption "${edit.body}"`;
    },
    setTime() {
      console.log(document.getElementById("primaryVideo").currentTime);
      this.$store.commit("setTime", document.getElementById("primaryVideo").currentTime);
    }
  },
  updated() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }
};
</script>

<style>
.v-application--wrap {
  min-height: auto !important;
  display: table-cell;
  vertical-align: middle;
}

#crowdcaptions-app {
  background: transparent !important;
}

#dockedCaption {
  margin-left: 4px;
  position: relative;
  z-index: 10;
}
</style>

<style scoped>
.crowdcaptions-container {
  text-align: center;
  padding: 0px 5px;
  position: relative;
  height: 7rem;
  overflow-y: visible;
  transition: bottom 0.6s ease;
  bottom: 0;
}

.crowdcaptions-container.showEdits {
  position: relative;
  bottom: calc(6rem * 2.5);
}

.crowdcaptions-container:before {
  content: " ";
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: calc(6rem * 2.5 + 7rem);
  background: linear-gradient(to top, black 0%, #000a 80%, #0000);
  pointer-events: none;
  opacity: 0;
  will-change: opacity, bottom;
  transition: 0.6s ease opacity, 0.6s ease bottom;
}

.crowdcaptions-container.showEdits:before {
  opacity: 1;
  bottom: calc(6rem * -2.5);
}

#closeButton {
  height: 0;
  transition: 0.6s ease height, 0.6s ease opacity;
  opacity: 0;
}

.showEdits #closeButton {
  height: calc(5.8rem * 0.5);
  opacity: 1;
}
</style>
