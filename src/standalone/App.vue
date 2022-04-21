<template>
  <v-app id="app">
    <v-row id="app-row">
      <v-col cols="12" lg="8" order="last" order-lg="first" class="fill-height">
        <v-expansion-panels mandatory>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-row align="center">
                <v-col cols="auto"> Reports </v-col>
                <v-col>
                  <!-- Count of reports -->
                  <v-chip color="orange" text-color="white" v-if="newEdits.length > 0">
                    {{ newEdits.length }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ReportTable :edits="newEdits" v-if="newEdits" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-row align="center">
                <v-col cols="auto"> Archive </v-col>
                <v-col>
                  <!-- Count of reports -->
                  <v-chip color="primary" text-color="white" v-if="archivedEdits.length > 0">
                    {{ archivedEdits.length }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ReportTable :edits="archivedEdits" v-if="archivedEdits" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" lg="4">
        <v-container class="app-info">
          <h1 class="text-h4 brand">
            Crowd Captions
            <img class="brand-logo" :src="require('../assets/crowdcaptions-white.svg')" />
          </h1>
          <p>
            Crowd Captions is a collaborative student-driven resource for improving the quality of
            Panopto’s automatic captions. Students can submit manual corrections to the captions as
            they watch the video, and other students may vote on the most correct interpretation of
            what has been spoken.
          </p>
          <p>
            If a student abuses this system, others can report them. Reported captions, along with
            the original submitter’s UPI and the reporter’s information, is visible through this
            tool. We reccomend checking this once a week for any new reports. This will depend on
            the number of students in your course.
          </p>
          <v-card>
            <v-card-title>
              <div class="d-flex align-center usercard">
                <div class="flex-grow-1">
                  <span> {{ $user.userData.name }} </span><br />
                  <v-chip small>
                    <v-icon left small> mdi-email-outline </v-icon>
                    {{ $user.userData.email }}
                  </v-chip>
                </div>
                <div>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item link>
                        <v-list-item-title> Logout </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="$user.userData.access == 2"
                        :href="$backendHost + '/admin'"
                        target="admin"
                      >
                        <v-list-item-title> View Administration Panel </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-card-title>
          </v-card>
          <br />
          <!-- Export Content button -->
          <v-btn block class="export-button" color="primary" @click="exportReports">
            <v-icon>mdi-download</v-icon>
            Export All Reports
          </v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import { ExportToCsv } from "export-to-csv";
import ReportTable from "./components/ReportTable.vue";

export default {
  data() {
    return { edits: [] };
  },
  computed: {
    archivedEdits() {
      return this.edits.filter((edit) => edit.approved || edit.blocked);
    },
    newEdits() {
      return this.edits.filter((edit) => !edit.approved && !edit.blocked);
    },
  },
  async mounted() {
    const reportData = await fetch(`${this.$backendHost}/api/getReport`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.$user.token}`,
      },
      mode: "cors",
    }).then((response) => response.json());
    // Transform list of reports JSON into list of reports per suggestion
    const edits = {};
    reportData.forEach((report) => {
      // If the edit has not already been reported, create it
      const edit = edits[report.Edit.id] || report.Edit;
      // Add the report to the edit
      edit.Reports = edit.Reports || [];
      edit.Reports.push({
        id: report.id,
        createdAt: report.createdAt,
        Reporter: report.User,
      });
      // Store the edit in the list of edits
      edits[report.Edit.id] = edit;
    });
    console.log(edits);
    this.edits = Object.values(edits);

    // Generate exportable version of the report list
    this.rawReports = reportData
      .map((report) => ({
        id: report.id,
        createdAt: report.createdAt,
        Reporter: report.User.username,
        EditID: report.Edit.id,
        EditBody: report.Edit.body,
        OriginalCaption: report.Edit.CaptionSentence.body,
        EditApproved: report.Edit.approved,
        EditBlocked: report.Edit.blocked,
        SessionID: report.Edit.CaptionSentence.CaptionFileLectureId,
        CaptionStartTime: report.Edit.CaptionSentence.start,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  },
  methods: {
    exportReports() {
      const csvExporter = new ExportToCsv({
        filename: "crowdcaptions-report.csv",
        columnDelimiter: ",",
        showLabels: true,
        headers: [
          "Report ID",
          "Report Created At",
          "Reporter",
          "Edit ID",
          "Edit Body",
          "Original Caption",
          "Edit Approved",
          "Edit Blocked",
          "Video ID",
          "Caption Start Time",
        ],
      });
      csvExporter.generateCsv(this.rawReports);
    },
  },
  name: "App",
  components: { ReportTable },
};
</script>

<style scoped lang="scss">
#app {
  background-color: rgb(22, 18, 36);
  background-image: url("../assets/crowdcaptions.jpg");
  background-size: cover;
  background-position: center;
}

#app-row {
  margin: 1.5rem;
  align-content: flex-start;
  & > * {
    // Give each item padding
    padding: 1.5rem;
  }
}

.app-info {
  color: white;
}

.brand {
  margin-bottom: 1rem;
  .brand-logo {
    height: 1em;
    vertical-align: middle;
    float: right;
  }
}

.usercard {
  width: 100%;
}
</style>
