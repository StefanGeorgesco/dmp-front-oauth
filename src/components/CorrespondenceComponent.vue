<!-- eslint-disable prettier/prettier -->
<template>
  <div class="p-1 col-md-3" style="min-height: 12.5rem;">
    <div class="card h-100 shadow-sm">
      <div class="card-header">
        <div class="d-inline-flex align-items-center w-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3"
            viewBox="0 0 16 16">
            <path
              d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
            <path
              d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
          <a role="button" data-bs-toggle="modal" :data-bs-target="'#deleteModal-' + correspondence.id" class="ms-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill"
              viewBox="0 0 16 16">
              <path
                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
            </svg>
          </a>
        </div>
      </div>
      <div class="card-body">
        <h6 class="card-title">
          <span class="text-muted fst-italic">{{ correspondence.doctorId }} -</span>
          {{ correspondence.doctorFirstname }} {{ correspondence.doctorLastname }}
        </h6>
        <p class="card-text fst-italic">{{ correspondence.doctorSpecialties.join(", ") }}</p>
        <p class="card-text">Jusqu'au : {{ new Date(correspondence.dateUntil).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
  <div class="modal fade" :id="'deleteModal-' + correspondence.id" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Confirmez-vous la suppression de la correspondance du médecin
            {{ correspondence.doctorId }} - {{ correspondence.doctorFirstname }}
            {{ correspondence.doctorLastname }} qui était prévue jusqu'au
            {{ new Date(correspondence.dateUntil).toLocaleDateString() }} ?
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button @click="deleteCorrespondence" type="button" class="btn btn-primary">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions } from "pinia";
import { Modal } from "bootstrap";
import { useMessagesStore } from "../stores/messagesStore.js";
import { Service } from "../services/services.js";

export default {
  name: "CorrespondenceComponent",
  props: {
    correspondence: {
      type: Object,
      required: true,
    },
    canDelete: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["correspondenceUpdated"],
  methods: {
    async deleteCorrespondence() {
      Modal.getOrCreateInstance("#deleteModal-" + this.correspondence.id).hide();
      try {
        await Service.deleteCorrespondence(this.correspondence);
        this.$emit("correspondenceUpdated");
        this.setSuccessMessage("La correspondance a bien été supprimée.");
      } catch (error) {
        if (error.response.data?.message) {
          this.setErrorMessage(error.response.data.message);
        }
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>