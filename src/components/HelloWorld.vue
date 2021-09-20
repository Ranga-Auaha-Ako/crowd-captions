<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"> </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Crowd Captions</h1>
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="200"
        />

        <p class="subheading font-weight-regular"></p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Active</h2>
        <v-btn>
        <v-icon right class="material-icons-outlined"> toggle_on </v-icon>
        </v-btn>

        <v-row justify="center"> </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Settings</h2>
        <v-btn>
        <v-icon right class="material-icons-outlined"> settings </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
</script>
<style scoped>
</style>
