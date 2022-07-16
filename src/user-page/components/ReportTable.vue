<template>
  <div>
    <v-text-field
      v-model="searchQuery"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>

    <v-data-table
      :headers="reportHeaders"
      :items="reportBody"
      :items-per-page="10"
      :sort-by="'lastReported'"
      :sort-desc="true"
      :search="searchQuery"
      item-key="reportID"
      :group-by="showStatus ? 'isDeleted' : []"
      class="elevation-1"
      @click:row="showReport"
    >
      <template v-slot:group.header="{ headers, isOpen, toggle, group, items }">
        <td :colspan="headers.length" class="text-start" @click="toggle">
          <v-btn icon small class="ma-0">
            <v-icon>{{ isOpen ? "mdi-chevron-up" : "mdi-chevron-down" }} </v-icon>
          </v-btn>
          {{ group }}
          <v-chip small class="mr-2" v-if="items.length > 0">
            {{ items.length }}
          </v-chip>
        </td>
      </template>

      <template v-slot:item.actions>
        <!-- <template v-slot:item.actions="{ item }"> -->
        <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
        <!-- Button to link to details page -->
        <v-btn small icon color="primary">
          <v-icon small> mdi-eye </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="showDetails" width="900">
      <v-card v-if="showDetails && selectedReport">
        <v-card-title>
          <span class="text-h5">Report details</span>
          <v-spacer></v-spacer>
          <div v-if="!selectedReport.detail.blocked && !selectedReport.detail.approved">
            <v-btn
              :text="!selectedReport.detail.approved"
              dark
              color="green darken-4"
              @click="$emit('archiveReport', selectedReport.detail.id)"
              >Archive Report</v-btn
            >
            <v-btn
              :text="!selectedReport.detail.blocked"
              dark
              color="red darken-4"
              @click="$emit('deleteSuggestion', selectedReport.detail.id)"
              >Delete Suggestion</v-btn
            >
          </div>
          <div v-else>
            <v-btn
              dark
              color="green darken-4"
              @click="$emit('restoreReport', selectedReport.detail.id)"
              >Unarchive Report</v-btn
            >
          </div>
        </v-card-title>
        <v-card-text>
          <v-card dark>
            <v-card-text class="text-center text-h5 font-weight-black white--text">
              &ldquo;{{ selectedReport.reportedText }}&rdquo;
            </v-card-text>
          </v-card>
          <br />
          <v-row>
            <v-col cols="12" md="8" sm="7">
              <h3>Panopto-Generated Caption:</h3>
              <blockquote class="blockquote">
                &ldquo;{{ selectedReport.detail.CaptionSentence.body }}&rdquo;
              </blockquote>
            </v-col>
            <v-col cols="12" md="4" sm="5">
              <h3>Lecture:</h3>
              <p>{{ selectedReport.detail.CaptionSentence.CaptionFile.lecture_name }}</p>
              <v-btn
                block
                color="primary"
                target="_blank"
                :href="`https://auckland.au.panopto.com/Panopto/Pages/Viewer.aspx?id=${
                  selectedReport.detail.CaptionSentence.CaptionFile.lecture_id
                }&start=${Math.floor(selectedReport.detail.CaptionSentence.start / 1000)}`"
                >View Lecture</v-btn
              >
              <br />
              <h3>Report Time</h3>
              <p :title="selectedReport.reports[0].createdAt">
                {{ selectedReport.lastReported }} ({{ selectedReport.dateReported }})
              </p>
              <h3>Votes</h3>
              <p>
                <v-progress-linear
                  background-color="red"
                  color="green"
                  :value="
                    (selectedReport.upvotes / (selectedReport.downvotes + selectedReport.upvotes)) *
                    100
                  "
                ></v-progress-linear>
                <v-row>
                  <v-col>
                    <span
                      >{{ selectedReport.upvotes }} Upvote{{
                        selectedReport.upvotes.length == 1 ? "" : "s"
                      }}</span
                    >
                  </v-col>
                  <v-col cols="auto">
                    <span
                      >{{ selectedReport.downvotes }} Downvote{{
                        selectedReport.downvotes.length == 1 ? "" : "s"
                      }}.</span
                    >
                  </v-col>
                </v-row>
              </p>

              <!-- Can't embed iframe due to Panopto content security policy blocking iframes on chrome-extension urls -->
              <!-- <iframe
                :src="`https://auckland.au.panopto.com/Panopto/Pages/Embed.aspx?id=${selectedReport.detail.Edit.CaptionSentence.CaptionFile.lecture_id}&autoplay=false&offerviewer=true&showtitle=true&showbrand=true&captions=false&interactivity=all`"
                height="405"
                width="720"
                style="border: 1px solid #464646"
                allowfullscreen
                allow="autoplay"
              ></iframe> -->
            </v-col>
          </v-row>
          <p>
            This page allows you to approve or reject this caption suggestion. If you believe that
            this caption is innapropriate or offensive, you may wish to record the user who
            submitted it for further action.
          </p>

          <v-row>
            <v-col cols="12" sm="6">
              <v-card dark>
                <v-card-title class="text-h5"> Reported By </v-card-title>
                <v-expansion-panels flat>
                  <v-expansion-panel v-for="report in selectedReport.reports" :key="report.id">
                    <v-expansion-panel-header>
                      {{ report.Reporter.name }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col>
                          <v-list-item dense two-line>
                            <v-list-item-content>
                              <v-list-item-title>Name</v-list-item-title>
                              <v-list-item-subtitle>{{
                                report.Reporter.name
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                        <v-col>
                          <v-list-item dense two-line>
                            <v-list-item-content>
                              <v-list-item-title>UPI</v-list-item-title>
                              <v-list-item-subtitle>{{
                                report.Reporter.username
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                        <v-col>
                          <v-list-item dense two-line>
                            <v-list-item-content>
                              <v-list-item-title>Email</v-list-item-title>
                              <v-list-item-subtitle>{{
                                report.Reporter.email
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card dark>
                <v-card-title class="text-h5"> Submitted By </v-card-title>
                <v-row>
                  <v-col>
                    <v-list-item dense two-line>
                      <v-list-item-content>
                        <v-list-item-title>Name</v-list-item-title>
                        <v-list-item-subtitle>{{
                          selectedReport.detail.User.name
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                  <v-col>
                    <v-list-item dense two-line>
                      <v-list-item-content>
                        <v-list-item-title>UPI</v-list-item-title>
                        <v-list-item-subtitle>{{
                          selectedReport.detail.User.username
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                  <v-col>
                    <v-list-item dense two-line>
                      <v-list-item-content>
                        <v-list-item-title>Email</v-list-item-title>
                        <v-list-item-subtitle>{{
                          selectedReport.detail.User.email
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>

                <v-card-actions>
                  <v-btn text :href="`mailto:${selectedReport.detail.User.email}`">
                    Send Email
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <!-- Original JSON for reference -->
          <!-- <pre>
          {{ JSON.stringify(selectedReport, null, 2) }}
          </pre> -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export default {
  props: {
    edits: Array,
    showStatus: Boolean,
  },
  data() {
    return {
      reportHeaders: [
        { text: "Suggestion", value: "reportedText" },
        { text: "Author", value: "author" },
        { text: "Score (upvotes/downvotes)", value: "votesFormatted" },
        { text: "Last Reported", value: "lastReported" },
        { text: "Number of Reports", value: "numReports" },
        { text: "", value: "actions", sortable: false },
      ],
      showDetails: false,
      selectedReportID: null,
      searchQuery: "",
    };
  },
  computed: {
    reportBody() {
      return this.edits.map((edit) => {
        const sortedReports = edit.Reports.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        let isDeleted = edit.blocked ? "Deleted" : "";
        if (!isDeleted && edit.approved) {
          isDeleted = "Archived";
        }

        return {
          reportedText: edit.body,
          author: edit.User.username,
          lastReported: timeAgo.format(Date.parse(sortedReports[0].createdAt)),
          dateReported: new Date(sortedReports[0].createdAt).toLocaleDateString("en-NZ"),
          reportID: edit.id,
          reports: sortedReports,
          numReports: sortedReports.length,
          upvotes: edit.upvotes,
          downvotes: edit.downvotes,
          votesFormatted: `${edit.upvotes + -1 * edit.downvotes} (${edit.upvotes}/${
            edit.downvotes
          })`,
          isDeleted,
          detail: edit,
        };
      });
    },
    selectedReport() {
      return this.reportBody.find((edit) => edit.reportID === this.selectedReportID);
    },
  },
  watch: {
    selectedReport(foundReport) {
      console.log(foundReport);
      if (!foundReport) {
        this.showDetails = false;
      }
    },
  },

  methods: {
    showReport(item) {
      this.showDetails = true;
      this.selectedReportID = item.reportID;
    },
  },
  name: "ReportTable",
};
</script>
