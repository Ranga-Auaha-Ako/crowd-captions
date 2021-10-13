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
      <div class="crowdcaptions-container" :class="{ showEdits }">
        <div>
          <v-row id="closeButton" no-gutters align="center">
            <v-col>
              <v-btn @click="showEdits = false">Close</v-btn>
            </v-col>
          </v-row>
          <div v-for="(edit, index) in visibleEdits" :key="index">
            <CaptionAlt
              :edit="edit"
              :index="index"
              @show-edits="toggleEdits()"
              :open="showEdits"
              @save-caption="saveCaption"
              :isLarge="isLarge"
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
    </v-theme-provider>
  </v-app>
</template>

<script>
import CaptionAlt from "../components/CaptionAlt.vue";

export default {
  name: "App",
  computed: {
    currentCaption() {
      return this.$store.getters.currentCaption;
    },
    visibleEdits() {
      return this.showEdits
        ? this.currentCaption.edit.slice(0, this.maxAlternatives)
        : [this.currentCaption.edit[0]];
    }
  },
  components: {
    CaptionAlt
  },
  data() {
    return {
      showEdits: false,
      maxAlternatives: 3,
      theme: "dark",
      isLarge: false,
      snackbar: {
        show: false,
        text: "",
        timeout: 2000
      }
    };
  },
  methods: {
    toggleEdits() {
      this.showEdits = !this.showEdits;
    },
    saveCaption(edit) {
      this.snackbar.show = true;
      this.snackbar.text = `Submitted Caption "${edit.body}"`;
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
    }
  },
  updated() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  },
  mounted() {
    setTimeout(() => {
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
  background-color: black !important;
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
