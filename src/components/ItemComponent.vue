<!-- eslint-disable prettier/prettier -->
<template>
  <div class="p-2 col-12 col-xxl-11">
    <div class="card h-100 shadow-sm" :class="{ 'bg-light': item.editing }">
      <form ref="form" @submit.prevent="submitSaveItem" class="needs-validation" novalidate>
        <div class="card-header">
          <div class="d-inline-flex align-items-center w-100">
            <img v-if="imgurl" :src="imgurl" alt="" height="20" width="20" />
            <h6 class="my-0 ms-2">{{ types.filter((t) => t.value === item['@type'])[0]?.name }}</h6>
            <div v-if="item.id" class="fst-italic my-0 ms-2 d-none d-xl-block">
              - Créé par {{ item.authoringDoctorFirstname }}
              {{ item.authoringDoctorLastname }}
              ({{ item.authoringDoctorId }})
              - Spécialité{{ item.authoringDoctorSpecialties.length > 1 ? "s" : "" }} :
              {{ item.authoringDoctorSpecialties.join(", ") }}
            </div>
            <div class="me-auto"></div>
            <template v-if="!globalEditing && !item.editing && isAuthor">
              <a role="button" class="btn btn-primary me-1" @click="startEditing">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil"
                  viewBox="0 0 16 16">
                  <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </a>
              <a role="button" data-bs-toggle="modal" :data-bs-target="'#deleteModal-' + item.id"
                class="btn btn-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-trash-fill" viewBox="0 0 16 16">
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                </svg>
              </a>
            </template>
          </div>
          <div v-if="item.id" class="fst-italic my-0 ms-2 d-xl-none">
            Créé par {{ item.authoringDoctorFirstname }}
            {{ item.authoringDoctorLastname }}
            ({{ item.authoringDoctorId }}) -
            {{ item.authoringDoctorSpecialties.join(", ") }}
          </div>
        </div>
        <div class="card-body">
          <div class="row gx-3 gy-1">
            <div class="col-md-6">
              <div class="row mb-2">
                <label for="item_date" class="col-sm-3 col-md-6 col-form-label">
                  <span v-show="item.editing && !item.id">*</span>
                  Date
                </label>
                <div class="col-7 col-sm-5 col-md-6">
                  <input @change="($event) => $event.target.blur()" v-model="item.date" type="date"
                    :class="{ 'form-control': !item.id, 'form-control-plaintext': item.id }" id="item_date"
                    :readonly="item.id" required :max="new Date().toISOString().split('T')[0]" />
                  <div class="invalid-feedback" v-show="!item.date">
                    La date est obligatoire.
                  </div>
                  <div class="invalid-feedback" v-show="item.date">
                    La date ne peut pas être dans le futur.
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6" v-if="!item.id">
              <div class="row mb-2">
                <label for="item_type" class="col-sm-3 col-md-6 col-form-label">
                  <span v-show="item.editing && !item.id">*</span>
                  Type
                </label>
                <div class="col-7 col-sm-5 col-md-6">
                  <select @change="clearItem" v-model="item['@type']" :disabled="item.id" id="item_type"
                    class="form-select" required>
                    <option v-for="t in types.filter((t) => t.value)" :key="t.value" :value="t.value" v-text="t.name">
                    </option>
                  </select>
                  <div class="invalid-feedback">
                    Le type est obligatoire.
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="item['@type'] === 'act'">
              <div class="row mb-2">
                <label for="medical_act_input" class="col-sm-3 col-form-label">
                  <span v-show="item.editing">*</span>
                  Acte dispensé
                </label>
                <div class="col-sm-9">
                  <ObjectFinder object-type="medical-act" :object-value="item.medicalAct"
                    :object-rep-fn="(o) => `${o.id} - ${o.description}`" :object-filter-fn="(o) => true"
                    :has-error="mustCheck && !Boolean(item.medicalAct?.id)"
                    :no-error="mustCheck && Boolean(item.medicalAct?.id)" :read-only="!item.editing"
                    @new-selection="selectMedicalAct" />
                  <input type="text" class="d-none" id="medical_act_input" :value="item.medicalAct?.id" required>
                  <div class="invalid-feedback">
                    L'acte médical dispensé est obligatoire.
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="item['@type'] === 'diagnosis'">
              <div class="row mb-2">
                <label for="disease_input" class="col-sm-3 col-form-label">
                  <span v-show="item.editing">*</span>
                  Maladie diagnostiquée
                </label>
                <div class="col-sm-9">
                  <ObjectFinder object-type="disease" :object-value="item.disease"
                    :object-rep-fn="(o) => `${o.id} - ${o.description}`" :object-filter-fn="(o) => true"
                    :has-error="mustCheck && !Boolean(item.disease?.id)"
                    :no-error="mustCheck && Boolean(item.disease?.id)" :read-only="!item.editing"
                    @new-selection="selectDisease" />
                  <input type="text" class="d-none" id="disease_input" :value="item.disease?.id" required>
                  <div class="invalid-feedback">
                    La maladie diagnostiquée est obligatoire.
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="item['@type'] === 'mail'">
              <div class="row mb-2">
                <label for="doctor_input" class="col-sm-3 col-form-label">
                  <span v-show="item.editing">*</span>
                  Destinataire
                </label>
                <div class="col-sm-9">
                  <ObjectFinder object-type="doctor" :object-value="item.recipientDoctorId ? {
  id: this.item.recipientDoctorId,
  firstname: this.item.recipientDoctorFirstname,
  lastname: this.item.recipientDoctorLastname,
  specialties: this.item.recipientDoctorSpecialties,
} : null" :objectRepFn="(o) => `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties.map(s => s.description ? s.description : s).join(', ')}`"
                    :objectFilterFn="(o) => o.id !== userId" :has-error="mustCheck && !Boolean(item.recipientDoctorId)"
                    :no-error="mustCheck && Boolean(item.recipientDoctorId)" :read-only="!item.editing"
                    @new-selection="selectRecipientDoctor" />
                  <input type="text" class="d-none" id="doctor_input" :value="item.recipientDoctorId" required>
                  <div class="invalid-feedback">
                    Le médecin destinataire est obligatoire.
                  </div>
                </div>
              </div>
              <div class="row mb-2">
                <label for="mail_text" class="col-sm-3 col-form-label">
                  <span v-show="item.editing">*</span>
                  Texte
                </label>
                <div class="col-sm-9">
                  <div v-if="!item.editing" class="form-control-plaintext" style="white-space: pre-line">
                    {{ item.text }}
                  </div>
                  <textarea v-else v-model.trim="item.text" id="mail_text" required class="form-control" rows="3">
                  </textarea>
                  <div class="invalid-feedback">
                    Le texte du courrier est obligatoire.
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="item['@type'] === 'prescription' || item['@type'] === 'symptom'">
              <div class="row mb-2">
                <label for="description" class="col-sm-3 col-form-label">
                  <span v-show="item.editing">*</span>
                  Description
                </label>
                <div class="col-sm-9">
                  <div v-if="!item.editing" class="form-control-plaintext" style="white-space: pre-line">
                    {{ item.description }}
                  </div>
                  <textarea v-else v-model.trim="item.description" id="description" required class="form-control"
                    rows="3">
                  </textarea>
                  <div class="invalid-feedback">
                    La description
                    <span v-if="item['@type'] === 'prescription'">de la prescription</span>
                    <span v-else-if="item['@type'] === 'symptom'">du symptôme</span>
                    est obligatoire.
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="item.comments || item.editing">
              <div class="row mb-2">
                <label for="item_comments" class="col-sm-3 col-form-label">
                  Commentaire
                </label>
                <div class="col-sm-9">
                  <div v-if="!item.editing" class="form-control-plaintext" style="white-space: pre-line">
                    {{ item.comments }}
                  </div>
                  <textarea v-else v-model.trim="item.comments" id="item_comments" row="2" class="form-control"
                    rows="3">
                  </textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.editing" class="card-footer">
          <div class="row justify-content-center">
            <div class="col-5 col-xl-4">
              <div class="row gy-2 gx-5">
                <div class="col-md-6">
                  <div class="row">
                    <button type="submit"
                      class="btn btn-sm btn-primary d-inline-flex align-item-center justify-content-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        class="bi bi-check me-1" viewBox="0 0 16 16">
                        <path
                          d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                      </svg>
                      {{ item.id ? "Enregistrer" : "Créer" }}
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <a role="button"
                      class="col-md-6 btn btn-sm btn-secondary flex-grow-1 d-inline-flex align-item-center justify-content-center"
                      @click="cancelEditing">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        class="bi bi-x me-1" viewBox="0 0 16 16">
                        <path
                          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                      Annuler
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="modal fade" :id="'deleteModal-' + item.id" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Confirmez-vous la suppression de l'élément
            {{ item["@type"] }} du {{ new Date(item.date).toLocaleDateString() }} ?
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button @click="submitDeleteItem" type="button" class="btn btn-primary">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { nextTick } from 'vue';
import { mapActions, mapState } from "pinia";
import { Modal } from 'bootstrap';
import { useMessagesStore } from "../stores/messagesStore.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
  name: "ItemComponent",
  props: {
    itemValue: {
      type: Object,
      required: true,
    },
    globalEditing: {
      type: Boolean,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    }
  },
  emits: ["editingStart", "editingCanceled", "editingEnd"],
  components: {
    ObjectFinder,
  },
  data() {
    return {
      item: { ...this.itemValue },
      mustCheck: false,
    };
  },
  mounted() {
    if (!this.itemValue.id) this.$refs.form.scrollIntoView();
  },
  computed: {
    imgurl() {
      return this.types.filter((t) => t.value === this.item['@type'])[0]?.imgurl;
    },
    isAuthor() {
      return this.item.authoringDoctorId === this.userId;
    },
    ...mapState(useAuthUserStore, ["userId"]),
  },
  watch: {
    itemValue() {
      this.resetItem();
    },
  },
  methods: {
    resetItem() {
      this.item = { ...this.itemValue };
      this.mustCheck = false;
    },
    clearItem() {
      let type = this.item["@type"];
      this.resetItem();
      this.$refs.form.classList.remove("was-validated");
      this.item["@type"] = type;
    },
    startEditing() {
      this.item.editing = true;
      this.$emit('editingStart');
    },
    cancelEditing() {
      this.item.editing = false;
      this.$emit('editingCanceled');
    },
    selectMedicalAct(selection) {
      this.item.medicalAct = selection;
    },
    selectDisease(selection) {
      this.item.disease = selection;
    },
    selectRecipientDoctor(selection) {
      this.item.recipientDoctorId = selection?.id;
      this.item.recipientDoctorFirstname = selection?.firstname;
      this.item.recipientDoctorLastname = selection?.lastname;
      this.item.recipientDoctorSpecialties = selection?.specialties.map((s) => s.description);
    },
    async submitSaveItem($event) {
      let form = $event.target;
      if (form.checkValidity()) {
        let service;
        let action;

        if (this.item.id) {
          service = Service.updateItem;
          action = "modifié";
        } else {
          service = Service.addItem;
          action = "créé"
        }

        let id = this.setLoader();

        try {
          await service(this.item);
          this.item.editing = false;
          this.$emit("editingEnd");
          this.setSuccessMessage(`L'élément a bien été ${action}.`);
        } catch (error) {
          if (error.response.data?.message) {
            this.setErrorMessage(error.response.data.message);
          }
        } finally {
          this.clearLoader(id);
        }
      } else {
        form.classList.add("was-validated");
        this.mustCheck = true;
        this.setErrorMessage("Les données saisies sont incorrectes.");
        nextTick(() => {
          [...document.querySelectorAll(".invalid-feedback")].filter(
            el => getComputedStyle(el, null).display === "block"
          )[0]?.scrollIntoView(false);
        });
      }
    },
    async submitDeleteItem() {
      Modal.getOrCreateInstance("#deleteModal-" + this.item.id).hide();
      let id = this.setLoader();
      try {
        await Service.deleteItem(this.item);
        this.item.editing = false;
        this.$emit("editingEnd");
        this.setSuccessMessage(`L'élément a bien été supprimé.`);
      } catch (error) {
        if (error.response.data?.message) {
          this.setErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }

    },
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>