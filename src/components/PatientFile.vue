<!-- eslint-disable prettier/prettier -->
<template>
  <div class="row row-height p-2 px-xl-0">
    <div class="col-lg-3">
      <div class="row justify-content-center">
        <div class="col-xl-10 col-xxl-9 border rounded p-2 shadow-sm">
          <div class="nav nav-pills nav-justified flex-lg-column" role="tablist">
            <button class="nav-link active" id="info-tab" data-bs-toggle="pill" data-bs-target="#info-pane"
              type="button" role="tab" aria-controls="info-pane" aria-selected="true">
              <span class="d-none d-md-block">{{ role === "DOCTOR" ? "Informations" : "Médecin référent" }}</span>
              <span class="d-md-none">{{ role === "DOCTOR" ? "Infos" : "Référent" }}</span>
            </button>
            <button class="nav-link" id="file-tab" data-bs-toggle="pill" data-bs-target="#file-pane" type="button"
              role="tab" aria-controls="file-pane" aria-selected="false">
              <span class="d-none d-md-block">Dossier médical</span>
              <span class="d-md-none">Dossier</span>
            </button>
            <button class="nav-link" id="correspondence-tab" data-bs-toggle="pill" data-bs-target="#correspondence-pane"
              type="button" role="tab" aria-controls="correspondence-pane" aria-selected="false">
              <span class="d-none d-md-block">Médecins correspondants</span>
              <span class="d-md-none">Correspondants</span>
            </button>
            <RouterLink to="/main" v-if="role === 'DOCTOR'" class="nav-link text-secondary d-flex align-items-center justify-content-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-backspace me-1" viewBox="0 0 16 16">
                <path
                  d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
                <path
                  d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
              </svg>
              Retour
            </RouterLink>
          </div>
        </div>
        <div v-if="role === 'DOCTOR'" class="py-2 my-0 text-center d-none d-md-block">
          <span class="badge rounded-pill text-bg-secondary p-2">
            <span class="fst-italic">{{ file.id }} - </span>
            {{ file.firstname }} {{ file.lastname }}
          </span>
        </div>
      </div>
    </div>
    <div class="col-lg-9 ps-lg-3 h-100 overflow-auto">
      <div class="tab-content pb-4 col-xxl-11">
        <div class="tab-pane show active" id="info-pane" role="tabpanel" aria-labelledby="info-tab" tabindex="0">
          <div class="row p-3" v-if="file.id">
            <template v-if="role === 'DOCTOR'">
              <p class="h5 mb-3">{{ file.firstname }} {{ file.lastname }}</p>
              <p>Né(e) le {{ new Date(file.dateOfBirth).toLocaleDateString() }}</p>
              <p>Identifiant : {{ file.id }}</p>
            </template>
            <p class="fst-italic">
              <template v-if="role === 'PATIENT' || !isReferringDoctor">
                <span v-if="role === 'DOCTOR'">Médecin référent :</span>
                {{ file.referringDoctorFirstname }} {{ file.referringDoctorLastname }} ({{ file.referringDoctorId }})
                - {{ file.referringDoctorSpecialties.join(", ") }}
              </template>
              <template v-else>
                Vous êtes le médecin référent pour ce dossier.
              </template>
            </p>
          </div>
        </div>
        <div class="tab-pane" id="file-pane" role="tabpanel" aria-labelledby="file-tab" tabindex="0">
          <ItemsComponent :file="file" />
        </div>
        <div class="tab-pane" id="correspondence-pane" role="tabpanel" aria-labelledby="correspondence-tab"
          tabindex="0">
          <CorrespondencesComponent :file="file" />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import ItemsComponent from "./ItemsComponent.vue";
import CorrespondencesComponent from "./CorrespondencesComponent.vue";

export default {
  name: "PatientFile",
  components: {
    CorrespondencesComponent, ItemsComponent,
  },
  data() {
    return {
      file: {
        id: "",
        referringDoctorId: "",
        referringDoctorFirstname: "",
        referringDoctorLastname: "",
        referringDoctorSpecialties: [],
      },
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    isReferringDoctor() {
      return this.file.referringDoctorId === this.userId;
    },
    ...mapState(useAuthUserStore, ["role", "userId"]),
  },
  async created() {
    let id = this.setLoader();
    try {
      let response = await Service.getPatientFile(this.routeId);
      this.file = response.data;
    } catch (error) {
      if (error.response.data?.message) {
        this.addErrorMessage(error.response.data.message);
      }
    } finally {
      this.clearLoader(id);
    }
  },
  methods: {
    ...mapActions(useMessagesStore, ["addErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.row-height {
  height: calc(100vh - 3.5rem);
}
</style>