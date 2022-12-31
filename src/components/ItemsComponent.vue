<!-- eslint-disable prettier/prettier -->
<template>
  <div v-if="items.length - 1 * editing > 0" class="commands row g-1 mb-2 border rounded bg-white shadow-sm p-1 pb-2">
    <div class="col-sm-6 col-md-4">
      <input v-if="fetchedItems.length > 0" v-model="searchString" @keyup.esc="searchString = ''; $event.target.blur();"
        class="form-control form-control-sm" type="text" placeholder="Recherche...">
    </div>
    <div class="col-sm-6 col-md-4">
      <select v-if="fetchedItems.length > 0" v-model="typeFilter" @change="$event.target.blur(); cancelEditing()"
        class="form-select form-select-sm">
        <option v-for="t in types" :key="t.value" :value="t" v-text="t.category"></option>
      </select>
    </div>
    <div class="col-8 col-sm-6 col-md-3">
      <div class="d-inline-flex align-items-center justify-content-between">
        <img :src="typeFilter.imgurl" alt="" height="20" width="20" />
        <div v-if="processedItems.length - 1 * editing > 0" class="ps-1 fst-italic">
          ({{ processedItems.length - 1 * editing }})
        </div>
        <div v-if="fetchedItems.length > 0 && processedItems.length - 1 * editing > 1"
          class="btn-group btn-group-sm d-inline-block ms-2" role="group" aria-label="Choose order">
          <input @click="sortDirection = 1" type="radio" class="btn-check" name="direction_item" id="option_item_1"
            autocomplete="off" :checked="sortDirection === 1">
          <label class="btn btn-secondary" for="option_item_1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-caret-down-fill" viewBox="0 0 16 16">
              <path
                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </label>
          <input @click="sortDirection = -1" type="radio" class="btn-check" name="direction_item" id="option_item_2"
            autocomplete="off" :checked="sortDirection === -1">
          <label class="btn btn-secondary" for="option_item_2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-caret-up-fill" viewBox="0 0 16 16">
              <path
                d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            </svg>
          </label>
        </div>
      </div>
    </div>
    <div class="col-4 col-sm-6 col-md-1">
      <button v-if="role === 'DOCTOR' && !editing" @click="addItem" type="button"
        class="btn btn-sm btn-primary d-flex align-items-center justify-content-center ms-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20 " fill="currentColor"
          class="bi bi-file-earmark-plus" viewBox="0 0 16 16">
          <path
            d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
          <path
            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
        </svg>
      </button>
    </div>
  </div>
  <div v-if="items.length > 0" class="row d-flex flex-wrap px-1">
    <template v-if="processedItems.length === 0">
      <p>Aucun élément ne correspond à la sélection</p>
    </template>
    <ItemComponent v-for="item in processedItems" :key="item.id" :item-value="item" :types="types"
      :global-editing="editing" @editing-start="startEditing" @editing-canceled="cancelEditing"
      @editing-end="completeEditing" />
  </div>
  <div v-else class="row p-3">
    <p>Il n'y a aucun élément médical {{ role === "PATIENT" ? "dans votre" : "sur ce" }} dossier.</p>
  </div>
  <button v-if="role === 'DOCTOR' && !editing" @click="addItem" type="button"
    class="btn btn-primary d-flex align-items-center justify-content-center py-2 m-3">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20 " fill="currentColor"
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
import ItemComponent from "./ItemComponent.vue";
import { filterFn } from "../utils/utils";
import imgUrlAll from "../assets/svg/all.svg";
import imgUrlAct from "../assets/svg/act.svg";
import imgUrlDiagnosis from "../assets/svg/diagnosis.svg";
import imgUrlMail from "../assets/svg/mail.svg";
import imgUrlPrescription from "../assets/svg/prescription.svg";
import imgUrlSymptom from "../assets/svg/symptom.svg";

export default {
  name: "ItemsComponent",
  components: {
    ItemComponent,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: [],
      fetchedItems: [],
      editing: false,
      types: [
        {
          category: "Tous",
          value: "",
          imgurl: imgUrlAll,
        },
        {
          category: "Actes",
          value: "act",
          imgurl: imgUrlAct,
          name: "Acte médical",

        },
        {
          category: "Diagnostics",
          value: "diagnosis",
          imgurl: imgUrlDiagnosis,
          name: "Diagnostic",
        },
        {
          category: "Courriers",
          value: "mail",
          imgurl: imgUrlMail,
          name: "Courrier",
        },
        {
          category: "Prescriptions",
          value: "prescription",
          imgurl: imgUrlPrescription,
          name: "Prescription",
        },
        {
          category: "Symptômes",
          value: "symptom",
          imgurl: imgUrlSymptom,
          name: "Symptôme",
        },
      ],
      typeFilter: {},
      sortDirection: 1,
      searchString: "",
    };
  },
  async created() {
    this.typeFilter = this.types[0];
    this.fetchItems();
  },
  watch: {
    fetchedItems: {
      handler() {
        this.items = this.fetchedItems.map((item) => ({ ...item }));
      },
      deep: true,
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    processedItems() {
      return this.items.filter((item) => item.id ? item["@type"].indexOf(this.typeFilter.value) >= 0 : true)
        .filter(filterFn(this.searchString))
        .sort((i1, i2) => {
          if (!i1.id) return 1;
          if (!i2.id) return -1;
          return this.sortDirection * (new Date(i1.date) - new Date(i2.date));
        });
    },
    ...mapState(useAuthUserStore, ["role", "userId"]),
  },
  methods: {
    async fetchItems() {
      let id = this.setLoader();
      try {
        let response = await Service.getItems(this.routeId);
        this.fetchedItems = response.data;
      } catch (error) {
        if (error.response.data?.message) {
          this.addErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }

    },
    startEditing() {
      this.editing = true;
    },
    cancelEditing() {
      this.editing = false;
      this.items = this.fetchedItems.map((item) => ({ ...item }));
    },
    completeEditing() {
      this.editing = false;
      this.typeFilter = this.types[0],
        this.searchString = "";
      this.fetchItems();
    },
    addItem() {
      this.editing = true;
      this.items.push({
        "@type": null,
        date: new Date().toISOString().slice(0, 10),
        authoringDoctorId: this.userId,
        patientFileId: this.file.id,
        editing: true,
      });
    },
    ...mapActions(useMessagesStore, ["addErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.commands {
  position: sticky;
  top: 0rem;
  z-index: 1010;
}
</style>