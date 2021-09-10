<template>
  <v-row>
    <v-col>
      <v-row>
        <v-btn>
          <v-icon left class="material-icons"> arrow_upward </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-btn>
          <v-icon left class="material-icons"> arrow_downward </v-icon>
        </v-btn>
      </v-row>
    </v-col>
    <v-col>
      <!-- displays the current - 
      since App passes in the content at the given index anyway, 
      index is not used here -->
      <!-- <div :content="edit"></div> -->
      <p>{{ edit.text }}</p>
    </v-col>
    <v-col>
      <v-row>
        <v-btn @click="setDisabled(false)">
          <v-icon right class="material-icons"> create </v-icon>
        </v-btn>
        <v-text-field
          v-model="edited"
          :label="Regular"
          :disabled="setDisabled(true)"
          @keydown.enter="editButton()"
          clearable
        >
        </v-text-field>
      </v-row>
      <v-row>
        <v-btn v-if="index == 0">
          <!-- index used here; if first Cap - display the dropdown -->
          <v-icon right class="material-icons"> view_list </v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
// import { mdiAccount } from "@mdi/js";
// import App from "../content-scripts/App.vue";

export default {
  props: {
    index: Number,
    edit: String,
  },
  data() {
    return {
      edited: "",
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
  },
};
</script>
<style scoped></style>
