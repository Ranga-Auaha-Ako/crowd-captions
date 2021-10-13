<template>
  <v-card class="d-flex flex-row mx-3 p-1 caption" :class="{ open }">
    <v-row align="center" class="mx-1">
      <v-col cols="1" id="voteButtons">
        <v-row>
          <v-btn title="Like" icon small>
            <v-icon class="material-icons"> arrow_upward </v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-btn title="Dislike" icon small>
            <v-icon class="material-icons"> arrow_downward </v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col>
        <!-- displays the current - 
          since App passes in the content at the given index anyway, 
          index is not used here -->
        <!-- <div>{{ edit }}</div> -->
        <v-text-field
          id="captionField"
          ref="captionField"
          hide-details="true"
          outlined
          v-model="edited"
          :disabled="!open"
          @focus="isEditing = true"
          @blur="isEditing = false"
          @keydown.enter="toggleEditState()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1" id="captionActions" justify="end">
        <v-btn
          title="Show more..."
          v-if="!open && index == 0"
          icon
          small
          @click="toggleShowEdits()"
        >
          <!-- index used here; if first Cap - display the dropdown -->
          <v-icon class="material-icons"> view_list </v-icon>
        </v-btn>
        <v-btn
          title="Suggest Changes"
          v-else
          fab
          small
          @click="toggleEditState()"
          :color="isEditing ? 'primary' : ''"
        >
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
  watch: {
    edit(val) {
      this.edited = val.body;
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
<style>
.v-input--is-disabled input#captionField {
  color: white !important;
}

input#captionField {
  text-align: center;
  font-size: 1.3em;
}
</style>

<style scoped>
.hidden {
  visibility: hidden;
  opacity: 0;
}

.caption {
  /* Total height: 7.6rem */
  height: 5rem;
  padding: 0.8rem;
  margin: 1rem;
}

#captionActions,
#voteButtons {
  opacity: 0.1;
  transition: 0.4s ease opacity;
}

.caption:hover #captionActions,
.caption:hover #voteButtons,
.caption.open #captionActions,
.caption.open #voteButtons {
  opacity: 1;
}
</style>
