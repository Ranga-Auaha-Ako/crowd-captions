<template>
  <div class="crowdcaptions-container">
    <div v-for="(edit, index) in currentCaption.edits" :key="index">
      <CaptionAlt :edit="edit" :index="index" />
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
};
</script>

<style scoped>
.crowdcaptions-container p {
  text-align: center;
}
</style>
