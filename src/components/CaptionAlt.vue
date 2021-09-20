<template>
  <div v-if="index == 0 || showEdits">
    <v-card class="d-flex flex-row">
      <v-row>
        <v-col class="flex-grow-0">
          <v-row>
            <v-btn icon small>
              <v-icon class="material-icons"> arrow_upward </v-icon>
            </v-btn>
          </v-row>
          <v-row>
            <v-btn icon small>
              <v-icon class="material-icons"> arrow_downward </v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col>
          <!-- displays the current - 
          since App passes in the content at the given index anyway, 
          index is not used here -->
          <!-- <div :content="edit"></div> -->
          <p>{{ edit.body }}</p>
          <v-text-field
            :hidden="setDisabled(true)"
            v-model="edited"
            :label="Regular"
            @keydown.enter="editButton()"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col class="flex-grow-0">
          <v-btn fab color="primary" small @click="setDisabled(false)">
            <v-icon class="material-icons"> create </v-icon>
          </v-btn>
          <v-btn fab small @click="toggleShowEdits()" v-if="index == 0">
            <!-- index used here; if first Cap - display the dropdown -->
            <v-icon class="material-icons"> view_list </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
// import { mdiAccount } from "@mdi/js";
// import App from "../content-scripts/App.vue";

export default {
  props: {
    index: Number,
    edit: Object,
    showEdits: Boolean
  },
  data() {
    return {
      edited: ""
    };
  },
  name: "CaptionAlt",
  methods: {
    setDisabled(dis) {
      return dis;
    },
    editButton() {
      // post to backend with edit + timestamp (and index?)
      const editedtext = this.edited;
      console.log(editedtext);
      // may need to add mutation this.$store.commit(mutation_meth, variable)
      this.setDisabled(true);
    },
    toggleShowEdits() {
      // camelcasing doesn't work with events: https://vuejs.org/v2/guide/components-custom-events.html?fbclid=IwAR2IBgB858gqdXbRwSwGpVTtSdAO9obkiJxSz1E31jHZSl6abIjLRrP2YPQ
      this.$emit("show-edits");
    }
  }
};
</script>
<style scoped>
.flex-grow-0 {
  flex-grow: 0;
}
</style>
