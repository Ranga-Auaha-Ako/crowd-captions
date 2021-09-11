<template>
  <div class="crowdcaptions-container">
    <div v-for="(edit, index) in currentCaption.edits" :key="index">
      <CaptionAlt v-if="index<=2" :edit="edit" :index="index" :showEdits="showEdits" v-on:show-edits="toggleEdits()"/>
    </div>
  </div>
</template>

<script>
import CaptionAlt from "../components/CaptionAlt.vue";

export default {
  name: 'App',
  computed: {
    currentCaption() {
      return this.$store.getters.currentCaption;
    },
  },
  components: {
    CaptionAlt,
  },
  data(){
    return{
      showEdits: false,
    };
  },
  methods:{
    toggleEdits(){
      this.showEdits = !this.showEdits;
      // call resize event to fix captions
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }
  }
};
</script>

<style scoped>
.crowdcaptions-container p {
  text-align: center;
}
</style>
