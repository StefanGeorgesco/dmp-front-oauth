<!-- eslint-disable prettier/prettier -->
<template>
  <div v-if="correspondences.length > 0" class="row g-1 pb-3 mb-2 border-bottom">
    <div class="col-md-4">
      <input class="form-control form-control-sm" v-if="correspondences.length > 0" v-model="searchString"
        @keyup.esc="searchString = ''; $event.target.blur();" type="text" placeholder="Recherche...">
    </div>
    <div class="col-md-4">
      <div class="btn-group btn-group-sm d-inline-block" role="group" aria-label="Choose ongoing, past or all">
        <input @click="correspondenceFilter = 'ongoing'" type="radio" class="btn-check" name="select_by_age"
          id="select_by_age_ongoing" autocomplete="off" :checked="correspondenceFilter === 'ongoing'">
        <label class="btn btn-secondary" for="select_by_age_ongoing">
          En cours
        </label>
        <input @click="correspondenceFilter = 'past'" type="radio" class="btn-check" name="select_by_age"
          id="select_by_age_past" autocomplete="off" :checked="correspondenceFilter === 'past'">
        <label class="btn btn-secondary" for="select_by_age_past">
          Passées
        </label>
        <input @click="correspondenceFilter = 'all'" type="radio" class="btn-check" name="select_by_age"
          id="select_by_age_all" autocomplete="off" :checked="correspondenceFilter === 'all'">
        <label class="btn btn-secondary" for="select_by_age_all">
          Toutes
        </label>
      </div>
    </div>
    <div class="col-md-4">
      <div class="d-inline-flex align-items-center justify-content-between w-100">
        <div v-if="processedCorrepondences.length > 1" class="btn-group btn-group-sm d-inline-block" role="group"
          aria-label="Choose order">
          <input @click="sortDirection = 1" type="radio" class="btn-check" name="direction_correspondence"
            id="option_correspondence_1" autocomplete="off" :checked="sortDirection === 1">
          <label class="btn btn-secondary" for="option_correspondence_1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-caret-down-fill" viewBox="0 0 16 16">
              <path
                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </label>
          <input @click="sortDirection = -1" type="radio" class="btn-check" name="direction_correspondence"
            id="option_correspondence_2" autocomplete="off" :checked="sortDirection === -1">
          <label class="btn btn-secondary" for="option_correspondence_2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-caret-up-fill" viewBox="0 0 16 16">
              <path
                d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            </svg>
          </label>
        </div>
        <button v-if="isReferringDoctor && !addingCorrespondence" @click="addingCorrespondence = true" type="button"
          class="btn btn-sm btn-primary d-flex align-items-center justify-content-center ms-1 d-md-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-file-earmark-plus me-2" viewBox="0 0 16 16">
            <path
              d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
            <path
              d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
          </svg>
          Ajouter
        </button>
        <div class="d-inline-block ms-auto">
          <div v-if="processedCorrepondences.length > 1" class="d-flex align-items-center fst-italic">
            ({{ processedCorrepondences.length }} éléments)
          </div>
          <div v-else-if="processedCorrepondences.length === 1" class="d-flex align-items-center fst-italic">
            ({{ processedCorrepondences.length }} élément)
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row overflow-auto scroll-pane d-flex flex-wrap">
    <template v-if="correspondences.length > 0 && processedCorrepondences.length === 0">
      <p>Aucune correspondance ne correspond à la sélection.</p>
    </template>
    <CorrespondenceComponent v-for="correspondence in processedCorrepondences" :key="correspondence.id"
      :correspondence="correspondence" :can-delete="isReferringDoctor"
      @correspondence-updated="updateCorrespondences" />
    <AddCorrespondence v-if="addingCorrespondence"
      @correspondence-added="addingCorrespondence = false; updateCorrespondences();"
      @canceled="addingCorrespondence = false" :patient-file-id="file.id" />
  </div>
  <template v-if="!addingCorrespondence && correspondences.length === 0">
    <p>Il n'y a aucune correspondance {{ role === "PATIENT" ? "dans votre" : "sur ce" }} dossier.</p>
  </template>
  <button v-if="isReferringDoctor && !addingCorrespondence" @click="addingCorrespondence = true" type="button"
    class="btn btn-primary d-flex align-items-center justify-content-center py-2 mt-3 d-none d-md-block">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
      class="bi bi-file-earmark-plus me-2 mb-1" viewBox="0 0 16 16">
      <path
        d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
      <path
        d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
    </svg>
    Ajouter
  </button>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import CorrespondenceComponent from "./CorrespondenceComponent.vue";
import AddCorrespondence from "./AddCorrespondence.vue";
import { filterFn } from "../utils/utils";

export default {
  name: "CorrespondencesComponent",
  components: {
    CorrespondenceComponent, AddCorrespondence,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      correspondences: [],
      correspondenceFilter: "ongoing",
      sortDirection: 1,
      searchString: "",
      addingCorrespondence: false,
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    isReferringDoctor() {
      return this.file.referringDoctorId === this.userId;
    },
    processedCorrepondences() {
      let result;

      switch (this.correspondenceFilter) {
        case "all":
          result = [...this.correspondences];
          break;
        case "past":
          result = this.correspondences.filter(
            c => new Date(c.dateUntil).toISOString().split('T')[0] < new Date().toISOString().split('T')[0]
          );
          break;
        case "ongoing":
          result = this.correspondences.filter(
            c => new Date(c.dateUntil).toISOString().split('T')[0] >= new Date().toISOString().split('T')[0]
          );
          break;
        default:
          result = [...this.correspondences];
      }

      result = result.filter(filterFn(this.searchString));

      return result.sort((c1, c2) => this.sortDirection * (new Date(c1.dateUntil) - new Date(c2.dateUntil)));
    },
    ...mapState(useAuthUserStore, ["userId", "role"]),
  },
  async created() {
    this.updateCorrespondences();
  },
  methods: {
    async updateCorrespondences() {
      let id = this.setLoader();
      try {
        let response = await Service.getCorrespondences(this.routeId);
        this.correspondences = response.data;
        if (this.correspondenceFilter === "past") {
          this.correspondenceFilter = "ongoing";
        }
        this.searchString = "";
      } catch (error) {
        if (error.response.data?.message) {
          this.setErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.scroll-pane {
  max-height: calc(100vh - 16rem);
}
</style>