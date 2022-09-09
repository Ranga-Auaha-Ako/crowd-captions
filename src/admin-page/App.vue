<template>
  <v-app id="app">
    <v-row id="app-row">
      <v-col cols="12" lg="8" order="last" order-lg="first">
        <!-- Card containing course-owner relations -->
        <v-card>
          <v-card-title>
            <span class="headline">Folder Ownerships</span>
            <v-spacer></v-spacer>

            <v-text-field
              v-model="courseOwnershipsState.query"
              v-debounce="
                (val, evt) => {
                  courseOwnershipsState.debounce = val;
                }
              "
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <!-- Button to create new ownership -->
            <v-btn small color="success ml-4" @click="createCourseOwnership">
              <v-icon left>mdi-plus</v-icon>
              Create
            </v-btn>
          </v-card-title>
          <v-card-text>
            <template>
              <v-data-table
                :disable-sort="true"
                :headers="courseOwnershipsState.headers"
                :items="courseOwnerships.data"
                :items-per-page="10"
                :page.sync="courseOwnershipsState.page"
                :server-items-length="courseOwnerships.count"
                :footer-props="{
                  'disable-items-per-page': true,
                }"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editCourseOwnership(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteCourseOwnership(item.id)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
        </v-card>
        <br />
        <!-- Card containing list of videos -->
        <v-card>
          <v-card-title>
            <span class="headline"> Proccessed Videos </span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="allVideosState.query"
              v-debounce="
                (val, evt) => {
                  allVideosState.debounce = val;
                }
              "
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <template>
              <v-data-table
                :disable-sort="true"
                :headers="allVideosState.headers"
                :items="allVideos.data"
                :items-per-page="10"
                :page.sync="allVideosState.page"
                :server-items-length="allVideos.count"
                :footer-props="{
                  'disable-items-per-page': true,
                }"
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn small icon fab color="red" @click="deleteVideo(item.lecture_id)">
                    <v-icon small dark> mdi-delete </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
        </v-card>
        <br />
        <!-- Card containing list of users -->
        <v-card>
          <v-card-title>
            <span class="headline"> Users </span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="allUsersState.query"
              v-debounce="
                (val, evt) => {
                  allUsersState.debounce = val;
                }
              "
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <template>
              <v-data-table
                :disable-sort="true"
                :headers="allUsersState.headers"
                :items="allUsers.data"
                :items-per-page="10"
                :page.sync="allUsersState.page"
                :server-items-length="allUsers.count"
                :footer-props="{
                  'disable-items-per-page': true,
                }"
              >
                <template v-slot:item.access="{ item }">
                  <v-select
                    dense
                    v-model="item.access"
                    :items="accessLevels"
                    item-value="id"
                    item-text="name"
                    hide-details
                    @change="updateUserAccess(item, item.access)"
                  ></v-select>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
        </v-card>
        <br />
        <!-- Card containing list of recent edits -->
        <v-card>
          <v-card-title>
            <span class="headline"> Recent Edits </span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="recentEditsState.query"
              v-debounce="
                (val, evt) => {
                  recentEditsState.debounce = val;
                }
              "
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <template>
              <v-data-table
                :disable-sort="true"
                :headers="recentEditsState.headers"
                :items="recentEdits.data"
                :items-per-page="10"
                :page.sync="recentEditsState.page"
                :server-items-length="recentEdits.count"
                :footer-props="{
                  'disable-items-per-page': true,
                }"
              >
                <template v-slot:item.actions="{ item }">
                  <div class="text-center">
                    <v-btn
                      v-if="!item.blocked"
                      small
                      color="red"
                      dark
                      @click="deleteSuggestion(item)"
                      title="Delete Suggestion"
                    >
                      <v-icon small dark> mdi-delete </v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      small
                      icon
                      color="green"
                      dark
                      @click="archiveReport(item)"
                      title="Undelete Suggestion"
                    >
                      <v-icon small dark> mdi-undo </v-icon>
                    </v-btn>
                  </div>
                  <v-btn
                    class="d-block mx-auto"
                    small
                    icon
                    color="green"
                    dark
                    :href="`https://auckland.au.panopto.com/Panopto/Pages/Viewer.aspx?id=${
                      item.CaptionSentence.CaptionFile.lecture_id
                    }&start=${item.CaptionSentence.start / 1000}`"
                    title="View Lecture"
                    target="_blank"
                  >
                    <v-icon small dark> mdi-eye </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-container class="app-info d-flex flex-column align-stretch">
          <div>
            <h1 class="text-h4 brand">
              Admin Panel
              <v-icon class="brand-logo" dark large> mdi-security </v-icon>
            </h1>
          </div>
          <div>
            <v-card>
              <v-card-title>
                <div class="d-flex align-start usercard">
                  <div class="flex-grow-1">
                    <span> {{ $user.userData.name }} </span><br />
                    <v-chip small>
                      <v-icon left small> mdi-email-outline </v-icon>
                      {{ $user.userData.email }}
                    </v-chip>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <h6 class="text-overline black--text">Owned Folders</h6>
                <p class="text-body-2">
                  {{ ownedFolders.join(", ") }}
                </p>
              </v-card-text>
              <v-card-text>
                <h6 class="text-overline black--text">Owned Lectures</h6>
                <p class="text-body-2">
                  {{ ownedLectures.map((l) => l.name).join(", ") }}
                </p>
              </v-card-text>
            </v-card>
            <br />
            <v-btn block class="export-button mb-2" color="white" href="/index.html">
              <v-icon small>mdi-arrow-left</v-icon>
              Return to User Dashboard
            </v-btn>
            <v-btn block class="export-button mb-2" color="white" href="/analytics.html">
              View Analytics
              <v-icon small>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="courseOwnershipsState.dialog.edit" max-width="900">
      <v-card>
        <v-card-title class="text-h5">
          {{
            courseOwnershipsState.dialog.createNew
              ? "New Course Ownership"
              : "Editing Course Ownership"
          }}
        </v-card-title>

        <v-card-text>
          <v-combobox
            required
            :return-object="false"
            auto-select-first
            v-model="courseOwnershipsState.dialog.editState.user"
            label="User"
            item-text="name"
            item-value="upi"
            :search-input.sync="allUsersState.query"
            :items="allUsers.data"
          ></v-combobox>
          <v-combobox
            required
            :return-object="false"
            auto-select-first
            v-model="courseOwnershipsState.dialog.editState.lecture_folder"
            label="Folder"
            item-text="friendly_name"
            item-value="lecture_folder"
            :search-input.sync="folderSearchState.query"
            :items="folderSearch.data"
            :hide-no-data="true"
            :no-filter="true"
          ></v-combobox>
          <!-- Input for folder name -->
          <v-text-field
            required
            v-model="courseOwnershipsState.dialog.editState.folder_name"
            label="Folder Name"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="orange darken-1" text @click="courseOwnershipsState.dialog.edit = false">
            Discard Changes
          </v-btn>

          <v-btn
            v-if="!courseOwnershipsState.dialog.createNew"
            color="red darken-1"
            text
            @click="deleteCourseOwnership(courseOwnershipsState.dialog.editState.id)"
          >
            Delete Ownership
          </v-btn>

          <v-btn color="green darken-1" text @click="saveCourseOwnership">
            {{ courseOwnershipsState.dialog.createNew ? "Create" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { debounce } from "vue-debounce";
import relativeDate from "tiny-relative-date";

export default {
  data() {
    return {
      accessLevels: [
        {
          name: "Disabled User",
          id: -1,
        },
        {
          name: "Student",
          id: 0,
        },
        {
          name: "CourseAdmin",
          id: 1,
        },
        {
          name: "SuperAdmin",
          id: 2,
        },
      ],
      ownedLectures: [],
      ownedFolders: [],
      courseOwnershipsState: {
        page: 1,
        query: "",
        debounce: "",
        dialog: {
          createNew: true,
          edit: false,
          editState: {},
        },
        headers: [
          {
            text: "User",
            value: "User.name",
          },
          {
            text: "Folder",
            value: "folder_name",
          },
          {
            text: "Id",
            value: "id",
          },
          { text: "Actions", value: "actions", sortable: false },
        ],
      },
      allUsersState: {
        page: 1,
        query: "",
        debounce: "",
        headers: [
          {
            text: "Name",
            value: "name",
          },
          {
            text: "Upi",
            value: "username",
          },
          {
            text: "Edits",
            value: "EditCount",
          },
          {
            text: "Access Level",
            value: "access",
          },
        ],
      },
      allVideosState: {
        page: 1,
        query: "",
        debounce: "",
        headers: [
          {
            text: "Name",
            value: "lecture_name",
          },
          {
            text: "ID",
            value: "lecture_id",
          },
          {
            text: "Folder",
            value: "lecture_folder",
          },
          {
            text: "Date Ingested",
            value: "createdAtRelative",
          },
          { text: "Actions", value: "actions", sortable: false },
        ],
      },
      folderSearchState: {
        query: "",
        debounce: "",
      },
      recentEditsState: {
        page: 1,
        query: "",
        debounce: "",
        headers: [
          {
            text: "Name",
            value: "User.name",
          },
          {
            text: "Edit",
            value: "body",
          },
          {
            text: "Lecture",
            value: "CaptionSentence.CaptionFile.lecture_name",
          },
          {
            text: "Date",
            value: "createdAtRelative",
          },
          { text: "Actions", value: "actions", sortable: false },
        ],
      },
      refreshCount: 0, // To trigger refresh after form submits
    };
  },
  watch: {
    // eslint-disable-next-line func-names
    "allUsersState.query": function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.allUsersState.page = 1;
      }
    },
    // eslint-disable-next-line func-names
    "allVideosState.query": function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.allVideosState.page = 1;
      }
    },
    // eslint-disable-next-line func-names
    "folderSearchState.query": debounce(function (val) {
      // this.folderSearchState.debounce = val;
      this.folderSearchState.debounce = val ? val.replace(/ \(.+\)$/, "") : "";
    }, "300ms"),
    // eslint-disable-next-line func-names
    "courseOwnershipsState.dialog.editState.lecture_folder": function (val) {
      console.log(val);
      const folderName = this.folderSearch.data.find((f) => f.lecture_folder === val)?.folder_name;
      console.log(folderName);
      if (this.courseOwnershipsState.dialog.editState.folder_name === "" && folderName)
        this.courseOwnershipsState.dialog.editState.folder_name = folderName;
    },
    // eslint-disable-next-line func-names
    "recentEditsState.query": function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.recentEditsState.page = 1;
      }
    },
  },
  asyncComputed: {
    courseOwnerships: {
      watch: ["refreshCount"],
      default: { data: [], count: 0 },
      async get() {
        if (this.courseOwnershipsState.debounce === "") {
          return (await this.$AuthFetch.get(`admin/ownerships/${this.courseOwnershipsState.page}`))
            .data;
        }
        return (
          await this.$AuthFetch.get(`admin/ownerships/search/${this.courseOwnershipsState.page}`, {
            params: { query: this.courseOwnershipsState.debounce },
          })
        ).data;
      },
    },
    allUsers: {
      watch: ["refreshCount"],
      default: { data: [], count: 0 },
      async get() {
        if (this.allUsersState.debounce === "") {
          return (await this.$AuthFetch.get(`admin/users/${this.allUsersState.page}`)).data;
        }
        return (
          await this.$AuthFetch.get(`admin/users/search/${this.allUsersState.page}`, {
            params: { query: this.allUsersState.debounce },
          })
        ).data;
      },
    },
    allVideos: {
      watch: ["refreshCount"],
      default: { data: [], count: 0 },
      async get() {
        const res = (
          await this.$AuthFetch.get(`admin/videos/${this.allVideosState.page}`, {
            params:
              this.allVideosState.debounce === "" ? {} : { query: this.allVideosState.debounce },
          })
        ).data;
        if (res.error) {
          this.$dialog.notify.error(res.error);
        }
        const data = res.data.map((v) => ({ ...v, createdAtRelative: relativeDate(v.createdAt) }));
        return { count: res.count, data };
      },
    },
    folderSearch: {
      default: { data: [], count: 0 },
      async get() {
        if (!this.folderSearchState.debounce) {
          return { data: [], count: 0 };
        }
        const res = await this.$AuthFetch.get(`admin/folders/search`, {
          params: { query: this.folderSearchState.debounce },
        });
        return {
          count: res.data.count,
          data: res.data.data.map((f) => ({
            ...f,
            friendly_name: `${f.lecture_folder} (${f.folder_name})`,
          })),
        };
      },
    },
    recentEdits: {
      watch: ["refreshCount"],
      default: { data: [], count: 0 },
      async get() {
        const res = (
          await this.$AuthFetch.get(`admin/recent/${this.recentEditsState.page}`, {
            params:
              this.recentEditsState.debounce === ""
                ? {}
                : { query: this.recentEditsState.debounce },
          })
        ).data;
        if (res.error) {
          this.$dialog.notify.error(res.error);
        }
        const data = res.data.map((v) => ({ ...v, createdAtRelative: relativeDate(v.createdAt) }));
        return { count: res.count, data };
      },
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const ownedCourseData = (await this.$AuthFetch.get("/getOwned")).data;
      this.ownedLectures = ownedCourseData.courses.map((course) => ({
        name: course.lecture_name,
        id: course.lecture_id,
      }));
      this.ownedFolders = ownedCourseData.folders.map((folder) => folder.name);
    },
    createCourseOwnership() {
      this.courseOwnershipsState.dialog.createNew = true;
      this.courseOwnershipsState.dialog.editState = {
        user: "",
        lecture_folder: "",
        folder_name: "",
      };
      this.courseOwnershipsState.dialog.edit = true;
    },
    editCourseOwnership(ownership) {
      this.courseOwnershipsState.dialog.createNew = false;
      console.log(ownership);
      this.courseOwnershipsState.dialog.editState = {
        user: ownership.UserUpi,
        folder_name: ownership.folder_name,
        lecture_folder: ownership.lecture_folder,
        id: ownership.id,
      };
      console.log(this.courseOwnershipsState.dialog.editState);
      this.courseOwnershipsState.dialog.edit = true;
    },
    saveCourseOwnership() {
      this.$AuthFetch
        .post(
          `/admin/ownerships/${this.courseOwnershipsState.dialog.editState.id || ""}`,
          this.courseOwnershipsState.dialog.editState
        )
        .then(() => {
          this.courseOwnershipsState.dialog.edit = false;
          this.refreshCount += 1;
          this.fetchData();
        })
        .catch(() => {
          this.courseOwnershipsState.dialog.edit = false;
        });
    },
    deleteCourseOwnership(id) {
      this.$AuthFetch
        .delete(`/admin/ownerships/${id}`)
        .then(() => {
          this.courseOwnershipsState.dialog.edit = false;
          this.refreshCount += 1;
          this.fetchData();
        })
        .catch(() => {
          this.courseOwnershipsState.dialog.edit = false;
        });
    },
    async deleteVideo(id) {
      const confirm = await this.$dialog.confirm({
        text: "Are you sure you want to do this? Deleted sessions force a re-creation of video captions from Panopto, which will delete all student-submitted changes.",
        title: "Delete Video",
      });
      if (!confirm) return;
      this.$AuthFetch
        .delete(`/admin/videos/${id}`)
        .then(() => {
          this.refreshCount += 1;
          this.fetchData();
          this.$dialog.notify.success("Video deleted");
        })
        .catch(() => {
          this.$dialog.notify.error("Failed to delete video");
        });
    },
    // Edit {approved=true, blocked=false}
    async archiveReport(edit) {
      await this.$AuthFetch.post("/approvals", {
        approved: true,
        id: edit.id,
      });
      // If the suggestion was previously deleted, unblock it
      if (edit.blocked) {
        await this.$AuthFetch.post("/block", {
          blocked: false,
          id: edit.id,
        });
      }
      this.$dialog.notify.success("Selected edit is now visible");
      this.refreshCount += 1;
    },
    // Edit {approved=false, blocked=true}
    async deleteSuggestion(edit) {
      if (
        !(await this.$dialog.confirm({
          title: "Delete Suggestion",
          text: `Please confirm you wish to delete this suggestion?`,
        }))
      )
        return;
      await this.$AuthFetch.post("/block", {
        blocked: true,
        id: edit.id,
      });
      // If the suggestion was previously approved, unapprove it
      if (edit.approved) {
        await this.$AuthFetch.post("/approvals", {
          approved: false,
          id: edit.id,
        });
      }
      this.$dialog.notify.success("Selected edit is now hidden from users");
      this.refreshCount += 1;
    },
    async updateUserAccess(user, access) {
      const accessName = this.accessLevels.find((a) => a.id === access)?.name;
      if (
        (await this.$dialog.confirm({
          title: "Update User Access",
          text: `Please confirm you wish to update ${user.name}'s access level to "${accessName}"`,
        })) &&
        accessName
      ) {
        await this.$AuthFetch.post(`/admin/user/${user.upi}/access`, { access });
      }
      this.refreshCount += 1;
      this.fetchData();
    },
  },
  name: "App",
};
</script>

<style scoped lang="scss">
#app {
  background-color: #565656;
  background-image: linear-gradient(130deg, #ffffff 0%, #ffce57 20%, #ff0000 100%),
    url(/img/crowdcaptions.jpg);
  background-blend-mode: overlay;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

#app-row {
  margin: 1.5rem;
  align-content: flex-start;
  & > * {
    // Give each item padding
    padding: 1.5rem;
  }
  @media only screen and (max-width: 500px) {
    margin: 0rem;
  }
}

.app-info {
  color: white;
  height: 100%;
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
