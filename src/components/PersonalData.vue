<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container pb-2">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="row">
          <h1 id="top" class="h2">Données personnelles</h1>
        </div>
        <form @submit.prevent="submitUpdateFile" class="row mb-3 g-2 pt-3 needs-validation"
          novalidate autocomplete="off">
          <label for="id" class="col-md-4 col-form-label fw-semibold">Identifiant</label>
          <div class="col-md-8">
            <input v-model="file.id" type="text" class="form-control-plaintext" id="id" readonly>
          </div>
          <label for="first_name" class="col-md-4 col-form-label fw-semibold">Prénom</label>
          <div class="col-md-8">
            <input v-model="file.firstname" type="text" class="form-control-plaintext" id="first_name" readonly>
          </div>
          <label for="last_name" class="col-md-4 col-form-label fw-semibold">Nom</label>
          <div class="col-md-8">
            <input v-model="file.lastname" type="text" class="form-control-plaintext" id="last_name" readonly>
          </div>
          <template v-if="role === 'PATIENT'">
            <label for="date_of_birth" class="col-md-4 col-form-label fw-semibold">Date de naissance</label>
            <div class="col-md-8">
              <input v-model="file.dateOfBirth" type="date" class="form-control-plaintext user-select-none"
                id="date_of_birth" readonly>
            </div>
          </template>
          <template v-if="role === 'DOCTOR'">
            <label for="specialty_list" class="col-md-4 col-form-label fw-semibold">Spécialités</label>
            <div class="col-md-8">
              <input type="text" class="form-control-plaintext text-truncate" id="specialty_list"
                :value="file.specialties.map((s) => `${s.description}`).join(', ')" readonly>
            </div>
          </template>
          <label for="phone" class="col-md-4 col-form-label fw-semibold">
            Numéro de téléphone
            <span v-show="update">*</span>
          </label>
          <div class="col-md-8">
            <input v-model.trim="file.phone" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="phone" required
              :readonly="!update">
            <div class="invalid-feedback">
              Le numéro de téléphone est obligatoire.
            </div>
          </div>
          <label for="email" class="col-md-4 col-form-label fw-semibold">
            Adresse e-mail
            <span v-show="update">*</span>
          </label>
          <div class="col-md-8">
            <input v-model="file.email" type="email"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="email" required
              :readonly="!update">
            <div class="invalid-feedback">
              <span v-show="file.email.length === 0">L'adresse email est obligatoire.</span>
              <span v-show="file.email.length > 0">L'adresse email doit respecter le format.</span>
            </div>
          </div>
          <h2 class="h5 pt-3 pb-1 mb-0">Adresse</h2>
          <div class="col-md-4"></div>
          <AddressPicker class="col-md-8 mb-3" v-show="update" @new-selection="fillAddress"
            :error-message-service="setErrorMessage" :set-loader-service="setLoader"
            :clear-loader-service="clearLoader" />
          <div class="w-100 m-0"></div>
          <label for="street1" class="col-md-4 col-form-label fw-semibold">
            Numéro et voie
            <span v-show="update">*</span>
          </label>
          <div class="col-md-8">
            <input v-model.trim="file.address.street1" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="street1" required
              :readonly="!update">
            <div class="invalid-feedback">
              La voie est obligatoire.
            </div>
          </div>
          <label for="street2" class="col-md-4 col-form-label fw-semibold">Complément d'adresse</label>
          <div class="col-md-8">
            <input v-model.trim="file.address.street2" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="street2" :readonly="!update">
          </div>
          <label for="city" class="col-md-4 col-form-label fw-semibold">
            Commune
            <span v-show="update">*</span>
          </label>
          <div class="col-md-8">
            <input v-model.trim="file.address.city" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="city" required
              :readonly="!update">
            <div class="invalid-feedback">
              La commune est obligatoire.
            </div>
          </div>
          <label for="state" class="col-md-4 col-form-label fw-semibold">Etat ou région</label>
          <div class="col-md-8">
            <input v-model.trim="file.address.state" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="state" :readonly="!update">
          </div>
          <label for="zip_code" class="col-md-4 col-form-label fw-semibold">
            Code postal
            <span v-show="update">*</span>
          </label>
          <div class="col-md-8">
            <input v-model.trim="file.address.zipcode" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="zip_code" required
              :readonly="!update">
            <div class="invalid-feedback">
              Le code postal est obligatoire.
            </div>
          </div>
          <label for="country" class="col-md-4 col-form-label fw-semibold">
            Pays
            <span v-show="update">*</span>
          </label>
          <div class="col-md-8">
            <input v-model.trim="file.address.country" type="text"
              :class="{ 'form-control': update, 'form-control-plaintext': !update }" id="country" required
              :readonly="!update">
            <div class="invalid-feedback">
              Le pays est obligatoire.
            </div>
          </div>
          <div class="row justify-content-md-center">
            <div class="col-sm-6 col-md-4 g-0">
              <div class="vstack gap-2 mt-4">
                <button v-if="update" class="btn btn-primary d-flex align-items-center justify-content-center py-2"
                  type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                    class="bi bi-check me-1" viewBox="0 0 16 16">
                    <path
                      d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                  Valider
                </button>
                <a v-if="update" role="button" @click="init"
                  class="btn btn-secondary d-flex align-items-center justify-content-center py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                    class="bi bi-x me-1" viewBox="0 0 16 16">
                    <path
                      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                  Annuler
                </a>
                <a v-if="!update" role="button" @click="updateStart"
                  class="btn btn-primary d-flex align-items-center justify-content-center" style="padding: 0.75rem 0;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-pencil me-2" viewBox="0 0 16 16">
                    <path
                      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                  </svg>
                  Modifier
                </a>
                <RouterLink to="/main"
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
      </div>
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
import { nextTick } from "vue";
import { mapState, mapActions } from "pinia";
import { Modal } from "bootstrap";
import hash from "object-hash";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import AddressPicker from "./AddressPicker.vue";

export default {
  name: "PersonalData",
  components: {
    AddressPicker,
  },
  data() {
    return {
      update: false,
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
    };
  },
  computed: {
    dataChanged() {
      return this.fileHash !== hash(this.file);
    },
    ...mapState(useAuthUserStore, ["role"]),
  },
  async created() {
    this.init();
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
    async init() {
      let getService;
      if (this.role === "DOCTOR") {
        getService = Service.getDoctorDetails;
      } else {
        getService = Service.getPatientFileDetails;
      }
      try {
        let response = await getService();
        this.file = response.data;
        this.fileHash = hash(this.file);
        this.update = false;
        nextTick(() => {
          document.querySelector("form").classList.remove("was-validated");
          this.moveUp();
        });
      } catch (error) {
        if (error.response.data) {
          this.setErrorMessage(error.response.data.message);
        }
      }
    },
    updateStart() {
      this.update = true;
      nextTick(() => {
        document.querySelector("form").classList.remove("was-validated");
        this.moveUp();
      });
    },
    fillAddress(address) {
      this.file.address = address;
    },
    async submitUpdateFile($event) {
      if (!this.dataChanged) {
        this.setSuccessMessage("Données inchangées.");
        this.moveUp();
        return;
      }
      let form = $event.target;
      if (form.checkValidity()) {
        form.classList.remove("was-validated");
        let updateService;
        if (this.role === "DOCTOR") {
          updateService = Service.updateDoctorDetails;
        } else {
          updateService = Service.updatePatientFileDetails;
        }
        let id = this.setLoader();
        try {
          let response = await updateService(this.file);
          this.setSuccessMessage("Les données ont bien été modifiées.");
          this.file = response.data;
          this.fileHash = hash(this.file);
          this.update = false;
        } catch (error) {
          if (error.response.data?.message) {
            this.setErrorMessage(error.response.data.message);
          }
        } finally {
          this.clearLoader(id);
          nextTick(this.moveUp);
        }
      } else {
        form.classList.add("was-validated");
        this.setErrorMessage("Certaines données saisies sont manquantes ou incorrectes.");
        nextTick(() => {
          [...document.querySelectorAll(".invalid-feedback")].filter(
            el => getComputedStyle(el, null).display === "block"
          )[0]?.scrollIntoView(false);
        });
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>
