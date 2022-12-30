<!-- eslint-disable prettier/prettier -->
<template>
  <nav class="navbar navbar-expand-sm bg-light shadow-sm fixed-top">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Dmp</RouterLink>
      <button ref="navbarTogglerRef" class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle Menu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div ref="navbarMenuRef" class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav me-auto mb-2 mb-sm-0">
          <li class="nav-item" v-show="isAuthenticated">
            <RouterLink class="nav-link" to="/main">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house"
                viewBox="0 0 16 16">
                <path
                  d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
              </svg>
            </RouterLink>
          </li>
          <li v-show="isAuthenticated && role === 'ADMIN'" class="nav-item">
            <RouterLink class="nav-link" to="/manage-doctors">
              Médecins
            </RouterLink>
          </li>
          <li v-show="isAuthenticated && role === 'ADMIN'" class="nav-item">
            <RouterLink class="nav-link" to="/manage-patient-files">
              Patients
            </RouterLink>
          </li>
          <li v-show="!isAuthenticated" class="nav-item">
            <a class="nav-link" href="/" @click.prevent="login">Login</a>
          </li>
          <li v-show="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/sign-up">
              S'enregistrer
            </RouterLink>
          </li>
        </ul>
        <div v-show="isAuthenticated" class="dropdown">
          <a class="btn btn-outline-secondary dropdown-toggle d-inline-flex align-items-center gap-1" href=""
            role="button" data-bs-toggle="dropdown" @click.stop aria-expanded="false">
            {{ username }}
            <span class="vr"></span>
            {{ roles[role] }}
          </a>
          <ul class="dropdown-menu dropdown-menu-sm-end">
            <li v-show="role !== 'ADMIN'">
              <RouterLink class="dropdown-item" to="/personal-data">
                Données personnelles</RouterLink>
            </li>
            <li v-show="role !== 'ADMIN'">
              <hr class="dropdown-divider" />
            </li>
            <li>
              <a class="dropdown-item" href="/" @click.prevent="logout">Déconnexion</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <div class="position-fixed top-0 start-50 translate-middle-x mt-2" style="z-index: 1040;">
    <TransitionGroup name="messagesTransition" tag="div">
      <div v-for="message in messages" :key="message.id" role="alert"
        class="alert d-flex align-items-center justify-content-between py-2" :class="`alert-${message.type}`">
        {{ message.text }}
        <button @click="deleteMessage(message.id)" type="button" class="btn-close ms-2" aria-label="Close"></button>
      </div>
    </TransitionGroup>
  </div>
  <div v-show="loading" class="position-fixed top-50 start-50 translate-middle" style="z-index: 1100;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <main class="container-fluid pt-3" style="margin-top: 2.5rem;">
    <RouterView />
  </main>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { RouterLink, RouterView } from "vue-router";
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "./stores/authUserStore.js";
import { useMessagesStore } from "./stores/messagesStore.js";
import { useLoaderStore } from "./stores/loaderStore";

export default {
  name: "App",
  components: {
    RouterLink,
    RouterView,
  },
  data() {
    return {
      state: 0,
      roles: {
        ADMIN: "Administrateur",
        DOCTOR: "Médecin",
        PATIENT: "Patient",
      },
    };
  },
  created() {
    this.initAuth();
    document.addEventListener("click", this.foldMenu);
  },
  watch: {
    $route() {
      this.foldMenu();
      this.state++;
    },
  },
  computed: {
    ...mapState(useMessagesStore, ["messages"]),
    ...mapState(useAuthUserStore, ["isAuthenticated", "role", "username"]),
    ...mapState(useLoaderStore, ["loading"]),
  },
  methods: {
    foldMenu() {
      if (this.$refs.navbarMenuRef.classList.contains("show"))
        this.$refs.navbarTogglerRef.click();
    },
    ...mapActions(useMessagesStore, ["deleteMessage"]),
    ...mapActions(useAuthUserStore, ["initAuth", "login", "logout"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>
.messagesTransition-enter-active,
.messagesTransition-leave-active {
  transition: all 1s ease;
}

.messagesTransition-enter-from,
.messagesTransition-leave-to {
  opacity: 0;
}
</style>
