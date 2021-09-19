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
      <v-text-field
        v-show="setDisabledCall"
        v-model="edited"
        @keydown.enter="editButton()"
        clearable
      >
      </v-text-field>
    </v-col>
    <v-col>
      <v-row>
        <v-btn @click="disabling()">
          <v-icon right class="material-icons"> create </v-icon>
        </v-btn>
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
export default {
  props: {
    index: Number,
    edit: String,
  },
  data() {
    return {
      edited: "",
      setDisabled: false,
    };
  },
  name: "CaptionAlt",
  computed: {
    // this function watches the setDisabled changes.
    setDisabledCall() {
      return this.setDisabled;
    },
  },

  methods: {
    disabling() {
      // sets the default text in each edit component to current captions
      this.edited = this.edit.text;
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
  },
};
</script>
<style scoped></style>
