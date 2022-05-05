<template>
  <v-card elevation="2">
    <v-row>
      <v-col>
        <v-row>
          <v-btn :disabled="edit.panoptoGenerated">
            <v-icon left class="material-icons"> arrow_upward </v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-btn :disabled="edit.panoptoGenerated">
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
          <v-btn>
            <v-icon right class="material-icons"> create </v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-btn :disabled="edit.panoptoGenerated">
            <v-icon right class="material-icons"> flag </v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-btn>
            <!-- index used here; if first Cap - display the dropdown -->
            <v-icon right class="material-icons" v-if="index == 0"> view_list </v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// import { mdiAccount } from "@mdi/js";
// import App from "../content-scripts/App.vue";

export default {
  props: {
    index: Number,
    edit: String,
  },
  name: "CaptionAlt",
};
</script>
<style scoped></style>
