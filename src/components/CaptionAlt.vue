<template>
  <v-card elevation="2">
    <v-row>
    <v-col>
      <v-row>
        <v-btn>
          <v-icon left class="material-icons">
            arrow_upward
          </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-btn>
          <v-icon left class="material-icons">
            arrow_downward
          </v-icon>
        </v-btn>
      </v-row>
    </v-col>
    <v-col>
      <!-- displays the current edit at a given index (passed in through App) -->
      <div :content="edit"></div>
    </v-col>
    <v-col>
        <v-row>
      <v-btn>
        <v-icon right class="material-icons">
          create
        </v-icon>
      </v-btn>
      <v-row>
      <v-btn>
        <v-icon right class="material-icons" v-if="index == 0">
          view_list
        </v-icon>
      </v-btn>
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
