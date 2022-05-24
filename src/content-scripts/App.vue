<template>
  <v-app
    id="crowdcaptions-app"
    v-click-outside="
      () => {
        showEdits = false;
      }
    "
  >
    <v-theme-provider :dark="theme == 'dark'" :light="theme == 'light'">
      <div
        class="crowdcaptions-container"
        :class="{ showEdits }"
        :style="'--num-edits: ' + visibleEdits.length"
      >
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
              :user="user"
              @show-edits="toggleEdits()"
              @set-vote="setVote"
              @set-report="setReport"
              :open="showEdits"
              @save-caption="saveCaption"
              :isLarge="isLarge"
            />
          </div>
        </div>
        <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" color="blue-grey darken-4">
          {{ snackbar.text }}

          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-theme-provider>
  </v-app>
</template>

<script>
import CaptionAlt from "../components/CaptionAlt.vue";
import exportCaptions from "./util/exportCaptions";

export default {
  name: "App",
  components: {
    CaptionAlt,
  },
  data() {
    return {
      showEdits: false,
      maxAlternatives: 3,
      theme: "dark",
      isLarge: false,
      primaryVideo: null,
      snackbar: {
        show: false,
        text: "",
        timeout: 2000,
      },
      user: {
        // eslint-disable-next-line no-undef
        firstName: PanoptoUser.userData.name.split(/\s/)[0] || "",
        // eslint-disable-next-line no-undef
        upi: PanoptoUser.userData.username,
      },
    };
  },
  mounted() {
    // Handle externally emmitted Captions Export event
    this.$parent.$on("exportCaptions", () => {
      console.log("1: Exporting captions...");
      this.exportCaptions();
    });

    setTimeout(() => {
      // eslint-disable-next-line func-names
      document.getElementById("primaryVideo").ontimeupdate = this.setTime;
      // stop space bar from playing video when typing -- broken
      document.onkeydown = (e) => {
        if (e.key === " " && e.target === document.body) {
          // eslint-disable-next-line no-unused-expressions
          e.preventDefault;
        }
      };
      // disable secondary visual option (hovering subtitles)
      document.querySelector(
        "#captionsExpander .branded-border.placement-option.Overlay"
      ).style.display = "none";
      // get all the colour settings
      const colourElements = document.querySelectorAll("#captionColorOptions li");
      // disable third visual option (transparent)
      colourElements[2].style.display = "none";
      for (let i = 0; i < colourElements.length; i += 1) {
        colourElements[i].addEventListener("click", this.updateTheme);
      }
      // get all the size settings
      const sizeElements = document.querySelectorAll("#captionSizeOptions li");
      for (let i = 0; i < sizeElements.length; i += 1) {
        // update size
        sizeElements[i].addEventListener("click", this.updateSize);
      }
    }, 3000);
    this.$store.commit("loadCaptions", this.$captionData);
  },
  computed: {
    currentCaption() {
      return this.$store.getters.currentCaption;
    },
    visibleEdits() {
      let allCaptions = [];
      // AllCaptions will be the full array of edits if we have that
      if (this.currentCaption.edits) {
        allCaptions = [...this.currentCaption.edits];
      } else if (this.currentCaption.bestEdit.body) {
        // Otherwise, it will be just the best edit if we have that
        allCaptions = [this.currentCaption.bestEdit];
      }
      // Append default caption as fake "edit" to end of list of all captions. This will show up by default if there's no best edit or full list of edits
      allCaptions.push({
        body: this.currentCaption.body,
        id: `${this.currentCaption.id}-default`,
        votes: 0,
        voted: 0,
        reported: false,
        panoptoGenerated: true,
      });
      // Sort the list to place Caption element
      allCaptions.sort((a, b) => b.votes - a.votes);
      if (this.showEdits) {
        // Show all edits, with a limit
        return allCaptions.length > this.maxAlternatives
          ? allCaptions.slice(0, this.maxAlternatives)
          : allCaptions;
      }
      console.log(allCaptions);
      // Only show most liked
      return [allCaptions[0]];
    },
  },
  methods: {
    bestEdit(caption) {
      if (caption.edits) {
        if (!caption.edits.length) return caption.body;
        // Calculate fresh if we can
        const bestEdit = caption.edits.reduce((a, b) => (a.votes > b.votes ? a : b));
        // debugger;
        return bestEdit?.votes > 0 ? bestEdit.body : caption.body;
      }
      // debugger;
      return caption.bestEdit?.votes > 0 ? caption.bestEdit.body : caption.body;
    },
    toggleEdits() {
      // Pause video if it's not already paused
      const playButton = document.querySelector("#playButton[title=Pause]");
      if (playButton) playButton.click();
      // Show edits and reload
      this.showEdits = !this.showEdits;
      this.reloadEdits();
    },
    reloadEdits() {
      this.$store.commit("loadEdits", this.currentCaption.id);
    },
    saveCaption(edit) {
      this.snackbar.show = true;
      this.$store.commit("createEdit", edit);
      this.snackbar.text = `Thanks for your suggestion ${this.user.firstName} "${edit.body}"`;
      setTimeout(() => {
        this.reloadEdits();
      }, 500);
    },
    setVote(vote) {
      if (vote.edit.CaptionSentenceId != null) {
        this.$store.commit("setVote", vote);
        setTimeout(() => {
          this.showEdits = false;
          this.reloadEdits();
        }, 500);
      } else {
        this.snackbar.text = `Can't vote on panopto's original caption`;
      }
    },
    setReport(report) {
      console.log("REPORT", report);
      if (report.edit?.CaptionSentenceId) {
        this.$store.commit("setReport", report);
        setTimeout(() => {
          this.showEdits = false;
          this.reloadEdits();
        }, 500);
      } else {
        this.snackbar.text = `Can't report panopto's original caption`;
        this.snackbar.show = true;
      }
    },
    setTime() {
      this.$store.commit("setTime", document.getElementById("primaryVideo").currentTime);
    },
    updateTheme(e) {
      const themeValue = e.currentTarget.dataset.value;
      switch (themeValue) {
        case "LightOnDark":
          this.theme = "dark";
          break;
        case "DarkOnLight":
          this.theme = "light";
          break;
        default:
          // Theme not recognised, leave as is.
          break;
      }
    },
    updateSize(e) {
      const sizeValue = e.currentTarget.dataset.value;
      this.isLarge = sizeValue === "36";
    },
    exportCaptions() {
      exportCaptions(
        {
          captions: this.$store.state.Caption_file,
          lectureName: this.$store.state.source_data.Video_name,
          lectureID: this.$store.state.source_data.Lecture_id,
        },
        this.bestEdit
      );
    },
  },
  updated() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  },
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
  position: relative;
  z-index: 10;
  background-color: black !important;
}

.viewer #viewerContent #rightPane #dockedCaption #dockedCaptionTextWrapper {
  display: none !important;
}

.theme--dark.v-input--is-disabled input {
  color: white !important;
}
.theme--light.v-input--is-disabled input {
  color: black !important;
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
  bottom: calc(6rem * (var(--num-edits) - 0.5));
}

.crowdcaptions-container:before {
  content: " ";
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: calc(6rem * (var(--num-edits) - 0.5) + 7rem);
  background: linear-gradient(to top, black 0%, #000a 80%, #0000);
  pointer-events: none;
  opacity: 0;
  will-change: opacity, bottom;
  transition: 0.6s ease opacity, 0.6s ease bottom;
}

.crowdcaptions-container.showEdits:before {
  opacity: 1;
  bottom: calc(6rem * (var(--num-edits) - 0.5) * -1);
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
