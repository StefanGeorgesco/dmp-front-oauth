<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <div class="row mb-3">
      <h2 id="top">Créer un dossier {{ type === "doctor" ? "de médecin" : "patient" }}</h2>
    </div>
    <form v-show="!created" @submit.prevent="submitAddFile" class="needs-validation" novalidate autocomplete="off">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="id" class="form-label">* Identifiant</label>
          <input @input="file.id = file.id.toLocaleUpperCase();" v-model.trim="file.id" type="text" class="form-control"
            id="id" required>
          <div class="invalid-feedback">
            L'identifiant est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="firstname" class="form-label">* Prénom</label>
          <input v-model.trim="file.firstname" type="text" class="form-control" id="firstname" required>
          <div class="invalid-feedback">
            Le prénom est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="lastname" class="form-label">* Nom</label>
          <input v-model.trim="file.lastname" type="text" class="form-control" id="lastname" required>
          <div class="invalid-feedback">
            Le nom est obligatoire.
          </div>
        </div>
        <div v-if="type === 'doctor'" class="col-md-12">
          <label for="specialties_list" class="form-label">* Spécialités</label>
          <TagSelector @new-selection="updateSpecialtiesSelection" :options="specialties"
            :hasError="mustCheck && file.specialties.length === 0"
            :noError="mustCheck && file.specialties.length > 0" />
          <input type="text" class="d-none" id="specialties_list" :value="file.specialties.join(', ')" required>
          <div class="invalid-feedback">
            Le médecin doit avoir au moins une spécialité.
          </div>
        </div>
        <div v-if="type === 'patientFile'" class="col-md-4">
          <label for="date_of_birth" class="form-label">* Date de naissance</label>
          <input @change="($event) => $event.target.blur()" v-model="file.dateOfBirth" type="date" class="form-control"
            id="date_of_birth" required :max="new Date().toISOString().split('T')[0]">
          <div class="invalid-feedback" v-show="!file.dateOfBirth">
            La date de naissance est obligatoire.
          </div>
          <div class="invalid-feedback" v-show="file.dateOfBirth">
            La date de naissance ne peut pas être dans le futur.
          </div>
        </div>
        <div class="col-md-4">
          <label for="phone" class="form-label">* Numéro de téléphone</label>
          <input v-model.trim="file.phone" type="text" class="form-control" id="phone" required>
          <div class="invalid-feedback">
            Le numéro de téléphone est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="email" class="form-label">* Adresse e-mail</label>
          <input v-model="file.email" type="email" class="form-control" id="email" required>
          <div class="invalid-feedback" v-show="file.email.length === 0">
            L'adresse email est obligatoire.
          </div>
          <div class="invalid-feedback" v-show="file.email.length > 0">
            L'adresse email doit respecter le format.
          </div>
        </div>
      </div>
      <fieldset class="row g-3">
        <legend>Adresse</legend>
        <AddressPicker class="col-md-4" @new-selection="fillAddress" :error-message-service="addErrorMessage"
          :set-loader-service="setLoader" :clear-loader-service="clearLoader" />
        <div class="w-100 m-0"></div>
        <div class="col-md-4">
          <label for="street1" class="form-label">* Numéro et voie</label>
          <input v-model.trim="file.address.street1" type="text" class="form-control" id="street1" required>
          <div class="invalid-feedback">
            La voie est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="street2" class="form-label">Complément d'adresse</label>
          <input v-model.trim="file.address.street2" type="text" class="form-control" id="street2">
        </div>
        <div class="col-md-4">
          <label for="city" class="form-label">* Commune</label>
          <input v-model.trim="file.address.city" type="text" class="form-control" id="city" required>
          <div class="invalid-feedback">
            La commune est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="state" class="form-label">Etat ou région</label>
          <input v-model.trim="file.address.state" type="text" class="form-control" id="state">
        </div>
        <div class="col-md-4">
          <label for="zipcode" class="form-label">* Code postal</label>
          <input v-model.trim="file.address.zipcode" type="text" class="form-control" id="zipcode" required>
          <div class="invalid-feedback">
            Le code postal est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="country" class="form-label">* Pays</label>
          <input v-model.trim="file.address.country" type="text" class="form-control" id="country" required>
          <div class="invalid-feedback">
            Le pays est obligatoire.
          </div>
        </div>
      </fieldset>
      <div class="row justify-content-center justify-content-md-start">
        <div class="col-sm-6 col-md-3 g-0">
          <div class="vstack gap-2 mt-4 px-2 pb-4">
            <button class="btn btn-primary d-flex align-items-center justify-content-center py-2" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                class="bi bi-check me-1" viewBox="0 0 16 16">
                <path
                  d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
              Créer
            </button>
            <RouterLink :to="type === 'doctor' ? '/manage-doctors' : '/manage-patient-files'"
              class="btn btn-outline-secondary d-flex align-items-center justify-content-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                class="bi bi-backspace me-2" viewBox="0 0 16 16">
                <path
                  d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
                <path
                  d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
              </svg>
              Retour
            </RouterLink>
          </div>
        </div>
      </div>
    </form>
    <div class="row" v-show="created">
      <div class="col-12">
        <p>
          {{ creationMessage }}
          <span class="d-inline-block rounded px-1 ms-1 bg-light fst-italic user-select-all">
            {{ creationCode }}
          </span>
          <span class="btn btn-success d-inline-block btn-sm ms-3 py-0 mb-1" @click="copy">Copier</span>
        </p>
      </div>
      <div class="col-sm-4 col-md-2 mt-3">
        <RouterLink to="/main" class="btn btn-outline-secondary d-flex align-items-center justify-content-center py-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
            class="bi bi-backspace me-2" viewBox="0 0 16 16">
            <path
              d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
            <path
              d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
          </svg>
          Retour
        </RouterLink>
      </div>
      <br>
    </div>
  </div>
  <div class="modal fade" ref="discard_changes_modal" tabindex="-1" aria-labelledby="modal-label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal-label">Abandon des modifications</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Voulez-vous vraiment quitter la page ? Les données saisies seront perdues.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button ref="ok_button" type="button" class="btn btn-primary">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { nextTick } from 'vue';
import { Modal } from 'bootstrap';
import hash from "object-hash";
import { Service } from "../services/services.js";
import { useMessagesStore } from "../stores/messagesStore";
import { useLoaderStore } from '../stores/loaderStore';
import { mapActions } from "pinia";
import TagSelector from "./TagSelector.vue";
import AddressPicker from "./AddressPicker.vue";

export default {
  name: "AddFile",
  components: {
    TagSelector,
    AddressPicker,
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ["patientFile", "doctor"].includes(value);
      },
    },
  },
  data() {
    return {
      created: false,
      mustCheck: false,
      creationMessage: "",
      creationCode: "",
      specialties: [],
      file: {
        id: "",
        firstname: "",
        lastname: "",
        specialties: [],
        dateOfBirth: "",
        phone: "",
        email: "",
        address: {
          street1: "",
          street2: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
        },
      },
      fileHash: "",
    }
  },
  computed: {
    dataChanged() {
      return this.fileHash !== hash(this.file);
    },
  },
  async created() {
    this.fileHash = hash(this.file);
    if (this.type === "doctor") {
      try {
        let response = await Service.getSpecialties();
        this.specialties = response.data;
      } catch (error) {
        if (error.response.data) {
          this.addErrorMessage(error.response.data.message);
        }
      }
    }
  },
  async beforeRouteLeave(to) {
    if (to.name === "login" || !this.dataChanged)
      return true;

    let modalEl = this.$refs.discard_changes_modal;
    let confirmButton = this.$refs.ok_button;
    let modal = Modal.getOrCreateInstance(modalEl);

    return await new Promise((resolve) => {
      modalEl.addEventListener('hidden.bs.modal', () => resolve(false));
      confirmButton.addEventListener('click', () => { modal.hide(); resolve(true); });
      modal.show();
    });
  },
  methods: {
    moveUp() {
      document.querySelector("#top").scrollIntoView(false);
    },
    updateSpecialtiesSelection(specialties) {
      this.file.specialties = specialties;
    },
    fillAddress(address) {
      this.file.address = address;
    },
    async submitAddFile($event) {
      let form = $event.target;
      if (form.checkValidity()) {
        form.classList.remove("was-validated");
        this.mustCheck = false;
        let service;
        if (this.type === "doctor") {
          service = Service.addDoctor;
        } else {
          service = Service.addPatientFile;
        }
        let id = this.setLoader();
        try {
          let response = await service(this.file);
          this.addSuccessMessage(`Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} a bien été créé.`);
          this.creationMessage = `Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} ${response.data.id} pour ${response.data.firstname} ${response.data.lastname} a bien été créé. Veuillez transmettre ce code secret au ${this.type === "doctor" ? "médecin" : "patient"} afin qu'il puisse créer son compte : `;
          this.creationCode = `${response.data.securityCode}`;
          this.created = true;
          this.fileHash = hash(this.file);
        } catch (error) {
          if (error.response.data?.message) {
            this.addErrorMessage(error.response.data.message);
          }
          nextTick(this.moveUp);
        } finally {
          this.clearLoader(id);
        }
      } else {
        form.classList.add("was-validated");
        this.mustCheck = true;
        this.addErrorMessage("Certaines données saisies sont manquantes ou incorrectes.");
        nextTick(() => {
          [...document.querySelectorAll(".invalid-feedback")].filter(
            el => getComputedStyle(el, null).display === "block"
          )[0]?.scrollIntoView(false);
        });
      }
    },
    copy() {
      navigator.clipboard.writeText(this.creationCode)
        .then(() => this.addSuccessMessage("Le code a bien été copié dans le presse-papier."))
        .catch(() => this.addErrorMessage("Impossible de copier le code. Veuillez le copier 'à la main'."));
    },
    ...mapActions(useMessagesStore, ["addErrorMessage", "addSuccessMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>
