<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="row text-center mt-3 py-1 mb-1">
          <h1 class="h2">Gérer les dossiers {{ type === "doctor" ? "des médecins" : "patients" }}</h1>
        </div>
        <div class="row position-relative justify-content-center g-3 py-1 my-1">
          <input @keyup.esc="clear" @blur="delayedClear" v-model="searchString" type="text" @input="findFiles"
            class="form-control" placeholder="Recherche...">
          <div class="position-absolute top-100 start-0 mt-2 p-2 border rounded shadow bg-white overflow-auto"
            v-show="foundFiles.length > 0">
            <div class="option-item" v-for="file in foundFiles" :key="file.id" @click="select(file)">
              {{ file.id }} {{ file.firstname }} {{ file.lastname }}
            </div>
          </div>
        </div>
        <div v-if="selectedFile" class="row py-1 my-1">
          <FileCard @referring-doctor-updated="updateFile" @close="clear" @file-deleted="clear" :type="type"
            :file="selectedFile">
          </FileCard>
        </div>
        <div class="row justify-content-center mt-3 mb-3 py-1">
          <div class="col-md-8">
            <RouterLink to="/add-doctor" v-if="type === 'doctor' && role === 'ADMIN'"
              class="btn btn-primary d-flex align-items-center justify-content-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                class="bi bi-file-earmark-plus me-2" viewBox="0 0 16 16">
                <path
                  d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
                <path
                  d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
              </svg>
              Ajouter un médecin
            </RouterLink>
            <RouterLink to="/add-patient-file" v-if="type === 'patientFile' && role === 'DOCTOR'"
              class="btn btn-primary d-flex align-items-center justify-content-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                class="bi bi-file-earmark-plus me-2" viewBox="0 0 16 16">
                <path
                  d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
                <path
                  d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
              </svg>
              Ajouter un dossier patient
            </RouterLink>
          </div>
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
import FileCard from "./FileCard.vue";

export default {
  name: "ManageFiles",
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ["patientFile", "doctor"].includes(value);
      },
    },
  },
  components: {
    FileCard,
  },
  data() {
    return {
      searchString: "",
      foundFiles: [],
      selectedFile: null,
    }
  },
  computed: {
    ...mapState(useAuthUserStore, ["role"]),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.clear();
    })
  },
  beforeRouteLeave() {
    this.clear();
  },
  methods: {
    async findFiles() {
      this.selectedFile = null;
      let service;
      if (this.type === "doctor") {
        service = Service.findDoctorsByIdOrFirstnameOrLastname;
      } else {
        service = Service.findPatientFilesByIdOrFirstnameOrLastname;
      }
      let id = this.setLoader();
      try {
        let response = await service(this.searchString);
        this.foundFiles = response.data;
      } catch (error) {
        if (error.response.data?.message) {
          this.setErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    async updateFile(file) {
      let id = this.setLoader();
      try {
        let response = await Service.getPatientFile(file.id);
        this.select(response.data);
      } catch (error) {
        this.clear();
      } finally {
        this.clearLoader(id);
      }
    },
    select(f) {
      this.selectedFile = f;
      this.searchString = "";
      this.foundFiles = [];
    },
    clear() {
      this.searchString = "";
      this.foundFiles = [];
      this.selectedFile = null;
    },
    delayedClear() {
      setTimeout(() => {
        this.searchString = "";
        this.foundFiles = [];
      }, 200);
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>
.option-item:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
</style>