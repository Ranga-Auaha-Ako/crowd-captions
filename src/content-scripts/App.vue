<template>
  <v-app id="crowdcaptions-app">
    <div class="crowdcaptions-container" :class="{ showEdits }">
      <div>
        <v-btn v-if="showEdits" @click="showEdits = false">Close</v-btn>
        <div v-for="(edit, index) in visibleEdits" :key="index">
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
}

.crowdcaptions-container.showEdits {
  position: absolute;
  width: 100%;
  bottom: -70px;
  background: linear-gradient(to top, black 0%, #000a 80%, #0000);
}
</style>
