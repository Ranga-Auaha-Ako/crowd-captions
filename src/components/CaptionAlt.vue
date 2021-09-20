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
            v-show="setDisabledCall"
            v-model="edited"
            @keydown.enter="editButton()"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col class="flex-grow-0">
          <v-btn fab small @click="disabling()">
            <v-icon right class="material-icons"> create </v-icon>
          </v-btn>
          <v-btn fab small v-if="index == 0">
            <!-- index used here; if first Cap - display the dropdown -->
            <v-icon right class="material-icons"> view_list </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    edit: Object,
    showEdits: Boolean
  },
  data() {
    return {
      edited: "",
      setDisabled: false
    };
  },
  name: "CaptionAlt",
  computed: {
    // this function watches the setDisabled changes.
    setDisabledCall() {
      return this.setDisabled;
    }
  },

  methods: {
    disabling() {
      // sets the default text in each edit component to current captions
      this.edited = this.edit.body;
      // displays the field (if you click again it goes away without edit)
      if (this.setDisabled === false) {
        this.setDisabled = true;
      } else {
        this.setDisabled = false;
      }
    },
    editButton() {
      // post to backend with edit + timestamp (and index?)
      const editedtext = this.edited;
      console.log(editedtext);
      // may need to add mutation this.$store.commit(mutation_meth, variable)
      // when edit it taken, on enter hide the fields again
      this.setDisabled = false;
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
