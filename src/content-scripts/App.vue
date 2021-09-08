<template>
  <div class="crowdcaptions-container">
    <div v-for="(edit, index) in currentCaption.edits"
    :key="index">
      <p>{{edit.text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    currentCaption() {
      return this.$store.getters.currentCaption;
    },
  },
};
</script>

<style scoped>
.crowdcaptions-container p{
  text-align:center;
}
</style>
