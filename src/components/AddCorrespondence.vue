<!-- eslint-disable prettier/prettier -->
<template>
  <div class="p-2 col-md-4" style="min-height: 12.5rem;">
    <div ref="newCorrespondence" class="card h-100 bg-light shadow-sm">
      <form @submit.prevent="submitAddCorrespondence" class="needs-validation" novalidate>
        <div class="card-header">
          <div class="d-inline-flex align-items-center w-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3"
              viewBox="0 0 16 16">
              <path
                d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
              <path
                d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            <button type="submit" class="btn btn-primary btn-sm ms-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check"
                viewBox="0 0 16 16">
                <path
                  d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
            <a @click="cancelAction" role="button" class="btn btn-secondary btn-sm ms-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg"
                viewBox="0 0 16 16">
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            </a>
          </div>
        </div>
        <div class="card-body">
          <div class="row g-2">
            <div class="col-12">
              <label for="doctor_input" class="form-label">* Médecin correspondant</label>
              <ObjectFinder object-type="doctor" :object-value="doctor?.id ? doctor : null" :object-rep-fn="toString"
                :object-filter-fn="objectFilter" @new-selection="updateSelection"
                :has-error="mustCheck && !Boolean(correspondence?.doctorId)"
                :no-error="mustCheck && Boolean(correspondence?.doctorId)" />
              <input type="text" class="d-none" id="doctor_input" :value="correspondence?.doctorId" required>
              <div class="invalid-feedback">
                Le médecin est obligatoire.
              </div>
            </div>
            <div class="col-12">
              <label class="form-label" for="dateUntil">* Jusqu'au</label>
              <input @change="($event) => $event.target.blur()" class="form-control" v-model="correspondence.dateUntil"
                type="date" id="dateUntil" required :min="tomorrow.toISOString().split('T')[0]">
              <div class="invalid-feedback" v-show="!correspondence.dateUntil">
                La date est obligatoire.
              </div>
              <div class="invalid-feedback" v-show="correspondence.dateUntil">
                La date doit être dans le futur.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions, mapState } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useLoaderStore } from "../stores/loaderStore";
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
  name: "AddCorrespondence",
  props: {
    patientFileId: {
      type: String,
      required: true,
    },
  },
  components: {
    ObjectFinder,
  },
  emits: ["correspondenceAdded", "canceled"],
  data() {
    return {
      correspondence: null,
      tomorrow: null,
      mustCheck: false,
    };
  },
  created() {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.tomorrow = tomorrow;
    this.correspondence = {
      dateUntil: null,
      doctorId: null,
      patientFileId: this.patientFileId,
    };
  },
  mounted() {
    this.$refs.newCorrespondence.scrollIntoView(false);
  },
  computed: {
    doctor() {
      return {
        id: this.correspondence?.doctorId,
        firstname: this.correspondence?.doctorFirstname,
        lastname: this.correspondence?.doctorLastname,
        specialties: this.correspondence?.doctorSpecialties,
      };
    },
    ...mapState(useAuthUserStore, ["userId"]),
  },
  methods: {
    reset() {
      this.correspondence = {
        dateUntil: null,
        doctorId: null,
        patientFileId: this.patientFileId,
      };
      document.querySelector("form").classList.remove("was-validated");
      this.mustCheck = false;
    },
    updateSelection(selection) {
      this.correspondence.doctorId = selection?.id;
      this.correspondence.doctorFirstname = selection?.firstname;
      this.correspondence.doctorLastname = selection?.lastname;
      this.correspondence.doctorSpecialties = selection?.specialties.map(
        (s) => s.description
      );
    },
    async submitAddCorrespondence($event) {
      let form = $event.target;
      if (form.checkValidity()) {
        form.classList.remove("was-validated");
        this.mustCheck = false;
        let id = this.setLoader();
        try {
          await Service.addCorrespondence(this.correspondence);
          this.reset();
          this.$emit("correspondenceAdded");
          this.addSuccessMessage("La correspondance a bien été créée.");
        } catch (error) {
          if (error.response.data?.message) {
            this.addErrorMessage(error.response.data.message);
          }
        } finally {
          this.clearLoader(id);
        }
      } else {
        form.classList.add("was-validated");
        this.mustCheck = true;
        this.addErrorMessage("Les données saisies sont incorrectes.");
      }
    },
    cancelAction() {
      this.reset();
      this.$emit("canceled");
    },
    toString(o) {
      return `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties
        ?.map((s) => (s.description ? s.description : s))
        .join(", ")}`;
    },
    objectFilter(o) {
      return o.id !== this.userId;
    },
    ...mapActions(useMessagesStore, ["addErrorMessage", "addSuccessMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>
