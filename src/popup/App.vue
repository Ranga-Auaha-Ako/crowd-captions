<template>
  <v-app>
    <v-app-bar app prominent :src="require('../assets/crowdcaptions.jpg')">
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-toolbar-title> Crowd Captions </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="closeIfPermissionless"
            href="https://docs.crowdcaptions.raa.amazon.auckland.ac.nz/"
            target="_blank"
            ><v-list-item-title>Get help</v-list-item-title></v-list-item
          >
          <v-list-item
            @click="closeIfPermissionless"
            :href="`https://auckland.au1.qualtrics.com/jfe/form/SV_eCJsZ80IJVxD0to?upi=${user.upi}`"
            target="_blank"
            ><v-list-item-title>Give feedback</v-list-item-title></v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="text-justify">
        <div class="text-body-2 mb-4">
          <v-btn
            color="primary"
            block
            class="mb-2"
            v-if="user.moderator"
            href="/index.html"
            target="_blank"
            @click="closeIfPermissionless"
          >
            Moderation Dashboard
          </v-btn>

          Kia ora {{ user.name }}! Welcome to the beta for Crowd Captions. This tool will let you
          quickly jump in and suggest changes to the captions on lecture recordings.
        </div>
        <v-flex justify-space-around class="mb-4 d-flex" grow>
          <v-btn
            href="https://docs.crowdcaptions.raa.amazon.auckland.ac.nz/tutorial"
            target="_blank"
            color="primary"
            class=""
            @click="closeIfPermissionless"
            >View the tutorial</v-btn
          >
          <v-dialog width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" v-bind="attrs" v-on="on" class="">Give Feedback</v-btn>
            </template>

            <iframe
              style="border: none; border-radius: 0.4em; height: 950px; width: 100%"
              :src="`https://auckland.au1.qualtrics.com/jfe/form/SV_eCJsZ80IJVxD0to?upi=${user.upi}&version=${version}`"
            ></iframe>
          </v-dialog>
        </v-flex>
        <div class="text-body-2 mb-4">
          When you notice a mistake, suggest a change or vote on a better option. These suggestions
          will be shared with others in the class who are using this tool.
        </div>
        <v-btn v-if="withPermissions" color="primary" block class="mb-2" @click="exportCaptions">
          Export Captions
        </v-btn>
      </v-container>
    </v-main>
    <v-footer app class="d-flex justify-space-around text--secondary text-center">
      <div>Crowd Captions v{{ version }}</div>
      <div>
        <a
          href="https://www.auckland.ac.nz/en/copyright.html"
          class="text-decoration-none"
          style="color: inherit"
          >Copyright &copy; University of Auckland {{ new Date().getFullYear() }}</a
        >
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      withPermissions: new URL(document.location).searchParams.get("permissionless") !== "true",
      user: {
        // eslint-disable-next-line no-undef
        name: PanoptoUser.userData.name.split(/\s/)[0],
        // eslint-disable-next-line no-undef
        upi: PanoptoUser.userData.username,
        // eslint-disable-next-line no-undef
        moderator: PanoptoUser.userData.access >= 1,
      },
      version: process.env.PACKAGE_VERSION || "0",
    };
  },
  methods: {
    exportCaptions() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { content: "exportCaptions" }, (response) => {
          console.log(response);
        });
      });
    },
    closeIfPermissionless() {
      if (!this.withPermissions) {
        window.close();
      }
    },
  },
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
