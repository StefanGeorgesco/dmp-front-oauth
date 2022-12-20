<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container" v-if="role === 'ADMIN'">
    <div class="row justify-content-center g-5 py-3 mb-3">
      <div class="col-md-6 col-lg-4">
        <div class="card p-0 text-center">
          <img src="../assets/img/doctor.jpg" class="card-img-top" alt="médecin">
          <div class="card-body">
            <RouterLink to="/manage-doctors" type="button" class="btn btn-outline-primary stretched-link">Gérer les dossiers des
              médecins</RouterLink>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card p-0 text-center">
          <img src="../assets/img/patient.jpg" class="card-img-top" alt="patient">
          <div class="card-body">
            <RouterLink to="/manage-patient-files" type="button" class="btn btn-outline-primary stretched-link">Gérer les dossiers patients
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ManageFiles type="patientFile" v-else-if="role === 'DOCTOR'" />
  <PatientFile v-else-if="role === 'PATIENT'" />
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import ManageFiles from "./ManageFiles.vue";
import PatientFile from "./PatientFile.vue";

export default {
  name: "MainComponent",
  components: {
    ManageFiles, PatientFile,
  },
  computed: {
    ...mapState(useAuthUserStore, ["role"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>
