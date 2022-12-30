<!-- eslint-disable prettier/prettier -->
<template>
  <div class="card p-0 m-0">
    <div class="card-header d-inline-flex align-itms-center py-3">
      <h2 class="h5 card-title m-0">{{ file.id }} - {{ file.firstname }} {{ file.lastname }}</h2>
      <span class="btn btn-close ms-auto" @click="$emit('close')"></span>
    </div>
    <div class="card-body">
      <h3 class="h6 card-title mb-4">
        {{ type === "doctor" ? "Dossier de médecin" : "Dossier patient" }}
      </h3>
      <template v-if="type === 'patientFile'">
        <p class="card-text">
          Date de naissance : {{ new Date(file.dateOfBirth).toLocaleDateString() }}
        </p>
        <div v-show="!updatingReferringDoctor">
          <p class="card-text d-inline-flex align-items-center">
            <span>
              Médecin référent : {{ file.referringDoctorId }} - {{ file.referringDoctorFirstname }}
              {{ file.referringDoctorLastname }} ({{ file.referringDoctorSpecialties.join(", ") }})
            </span>
            <span v-if="role === 'ADMIN'" @click="updatingReferringDoctor = true" class="ms-2 btn btn-primary py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
                viewBox="0 0 16 16">
                <path
                  d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
            </span>
          </p>
        </div>
        <div v-show="updatingReferringDoctor">
          <form @submit.prevent="submitUpdateReferringDoctor">
            <ObjectFinder @new-selection="updateDoctorSelection" object-type="doctor" :object-value="referringDoctor"
              :object-rep-fn="toString" :object-filter-fn="objectFilter" />
            <div class="row justify-content-center">
              <div class="col-md-8 col-lg-6">
                <div class="vstack gap-2 mt-4">
                  <button class="btn btn-primary d-flex align-items-center justify-content-center py-2" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                      class="bi bi-check me-1" viewBox="0 0 16 16">
                      <path
                        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                    </svg>
                    Enregistrer
                  </button>
                  <a role="button" @click="cancelEditReferringDoctorAction"
                    class="btn btn-secondary d-flex align-items-center justify-content-center py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                      class="bi bi-x me-1" viewBox="0 0 16 16">
                      <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                    Annuler
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </template>
      <template v-else-if="type === 'doctor'">
        <p class="card-text">
          {{ file.specialties.map(s => s.description).join(", ") }}
        </p>
      </template>
    </div>
    <div class="card-footer" style="min-height: 3.5rem;">
      <RouterLink v-if="type === 'patientFile' && role === 'DOCTOR' && canEditKnown && canEdit" :to="viewFileUrl"
        class="btn btn-primary d-inline-flex align-items-center px-3" role="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-box-arrow-in-right me-2" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
          <path fill-rule="evenodd"
            d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
        </svg>
        Accéder au dossier
      </RouterLink>
      <button v-if="role === 'ADMIN' && !updatingReferringDoctor" type="button"
        class="btn btn-danger d-inline-flex align-items-center px-3" data-bs-toggle="modal"
        data-bs-target="#deleteModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
          class="bi bi-trash3-fill me-2" viewBox="0 0 16 16">
          <path
            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
        </svg>
        Supprimer le dossier
      </button>
    </div>
  </div>
  <div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="modalClose"></button>
        </div>
        <div class="modal-body">
          <p>Confirmez-vous la suppression du dossier {{ file.id }} - {{ file.firstname }} {{ file.lastname }}
            ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button @click="deleteFile" type="button" class="btn btn-primary">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { RouterLink } from "vue-router";
import { mapState, mapActions } from "pinia";
import { Modal } from "bootstrap";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
  name: "FileCard",
  emits: ["fileDeleted", "close", "referringDoctorUpdated"],
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ["patientFile", "doctor"].includes(value);
      },
    },
    file: {
      type: Object,
      required: true,
    },
  },
  components: {
    ObjectFinder, RouterLink,
  },
  data() {
    return {
      canEditKnown: false,
      canEdit: null,
      updatingReferringDoctor: false,
      referringDoctor: null,
      referringDoctorId: null,
    };
  },
  async created() {
    this.updateCanEdit();
    if (this.type === "patientFile") this.getReferringdoctor();
  },
  watch: {
    async file() {
      this.canEditKnown = false;
      this.canEdit = null;
      this.updateCanEdit();
    },
  },
  computed: {
    dataChanged() {
      return this.referringDoctorId !== this.referringDoctor.id;
    },
    viewFileUrl() {
      return `/view-${this.type === "doctor" ? "doctor" : "patient-file"}/${this.file.id}`;
    },
    ...mapState(useAuthUserStore, ["role"]),
  },
  methods: {
    async deleteFile() {
      Modal.getOrCreateInstance("#deleteModal").hide();
      let service;
      if (this.type === "doctor") {
        service = Service.deleteDoctor;
      } else {
        service = Service.deletePatientFile;
      }
      let id = this.setLoader();
      try {
        await service(this.file.id);
        this.$emit("fileDeleted");
        this.addSuccessMessage(`Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} ${this.file.id} a bien été supprimé, ainsi que le compte utilisateur associé.`)
      } catch (error) {
        if (error.response.data) {
          this.addErrorMessage(`Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} ne peut pas être supprimé.${this.type === "doctor" ? " Il est probablement référencé dans au moins un dossier patient." : ""}`);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    async updateCanEdit() {
      if (this.role === "DOCTOR" && this.type === "patientFile") {
        let id = this.setLoader();
        try {
          await Service.getCorrespondences(this.file.id);
          this.canEdit = true;
        } catch (error) {
          this.canEdit = false;
        } finally {
          this.canEditKnown = true;
          this.clearLoader(id);
        }
      }
    },
    async getReferringdoctor() {
      let id = this.setLoader();
      try {
        let response = await Service.getDoctor(this.file.referringDoctorId);
        this.referringDoctor = response.data;
        this.referringDoctorId = this.referringDoctor.id;
      } catch (error) {
        if (error.response.data?.message) {
          this.addErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    updateDoctorSelection(selection) {
      this.referringDoctor = selection;
    },
    async submitUpdateReferringDoctor() {
      if (!this.dataChanged) {
        this.addSuccessMessage("Données inchangées.");
        return;
      }
      let id = this.setLoader();
      try {
        await Service.updateReferringDoctor(this.file.id, this.referringDoctor);
        this.addSuccessMessage("Le médecin référent a bien été enregistré.");
        this.updatingReferringDoctor = false;
        this.referringDoctorId = this.referringDoctor.id;
        this.$emit("referringDoctorUpdated", this.file);
      } catch (error) {
        this.canEdit = false;
        if (error.response.data?.message) {
          this.addErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    cancelEditReferringDoctorAction() {
      if (this.type === "patientFile") this.getReferringdoctor();
      this.updatingReferringDoctor = false;
    },
    toString(o) {
      return `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties.map(s => s.description ? s.description : s).join(", ")}`;
    },
    objectFilter(o) {
      return o.id !== this.file.referringDoctorId;
    },
    ...mapActions(useMessagesStore, ["addErrorMessage", "addSuccessMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>
