<template>
  <v-card class="d-flex flex-row ma-3 pa-3">
    <v-row align="center">
      <v-col class="flex-grow-0 mx-3">
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
        <v-text-field
          ref="captionField"
          hide-details="true"
          outlined
          v-model="edited"
          @focus="isEditing = true"
          @blur="isEditing = false"
          @keydown.enter="editButton()"
          clearable
          :append-icon="'mdi-pencil'"
        >
        </v-text-field>
      </v-col>
      <v-col class="flex-grow-0">
        <v-btn v-if="!open && index == 0" fab small @click="toggleShowEdits()">
          <!-- index used here; if first Cap - display the dropdown -->
          <v-icon class="material-icons"> view_list </v-icon>
        </v-btn>
        <v-btn v-else fab small @click="toggleEditState()" :color="isEditing ? 'primary' : ''">
          <v-icon class="material-icons" v-if="isEdited"> save </v-icon>
          <v-icon class="material-icons" v-else> create </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    index: Number,
    edit: Object,
    open: Boolean
  },
  data() {
    return {
      edited: this.edit.body,
      setDisabled: false,
      isEditing: false
    };
  },
  name: "CaptionAlt",
  computed: {
    // this function watches the setDisabled changes.
    setDisabledCall() {
      return this.setDisabled;
    },
    isEdited() {
      return this.edited !== this.edit.body;
    }
  },

  methods: {
    toggleShowEdits() {
      // camelcasing doesn't work with events: https://vuejs.org/v2/guide/components-custom-events.html?fbclid=IwAR2IBgB858gqdXbRwSwGpVTtSdAO9obkiJxSz1E31jHZSl6abIjLRrP2YPQ
      this.$emit("show-edits");
    },
    toggleEditState() {
      if (this.isEdited) {
        console.log("Saving state");
        this.$refs.captionField.blur();
        this.$emit("save-caption", { body: this.edited });
      } else {
        console.log("Beggining Edit");
        this.$refs.captionField.focus();
      }
    }
  }
};
</script>
<style scoped></style>
