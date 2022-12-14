<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6 pb-3">
        <h1 class="fs-2 text-center py-3">S'enregistrer</h1>
        <form @submit.prevent="submitSignUp" class="row g-3 needs-validation py-3" novalidate>
          <div class="row">
            <div class="col-md-6">
              <label for="id" class="form-label">* Identifiant</label>
              <input style="text-transform: uppercase;" v-model.trim="user.id" type="text" class="form-control" id="id"
                required>
              <div class="invalid-feedback">
                L'identifiant est obligatoire.
              </div>
            </div>
            <div class="col-md-6">
              <label for="nom-utilisateur" class="form-label">* Nom d'utilisateur</label>
              <input v-model.trim="user.username" type="text" class="form-control" id="nom-utlisateur" required>
              <div class="invalid-feedback">
                Le nom d'utilisateur est obligatoire.
              </div>
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">* Mot de passe</label>
              <input @input="checkPasswordRepeat = false" v-model.trim="user.password" type="password"
                class="form-control" id="password" required minlength="4">
              <div class="invalid-feedback" :class="{ 'd-none': user.password.length > 0 }">
                Le mot de passe est obligatoire.
              </div>
              <div class="invalid-feedback" :class="{ 'd-none': user.password.length === 0 }">
                Le mot de passe doit comporter au moins 4 caractères.
              </div>
            </div>
            <div class="col-md-6">
              <label for="passwordRepeat" class="form-label">* Veuillez ressaisir le mot de passe</label>
              <input @input="checkPasswordRepeat = false" v-model="passwordRepeat" type="password" class="form-control"
                id="passwordRepeat" :pattern="checkPasswordRepeat ? user.password : '.*'" required>
              <div class="invalid-feedback" :class="{ 'd-none': passwordRepeat.length > 0 }">
                Le mot de passe doit être resaissi.
              </div>
              <div class="invalid-feedback" :class="{ 'd-none': passwordRepeat.length === 0 }">
                Le mot de passe resaissi doit être identique.
              </div>
            </div>
            <div class="col-md-6">
              <label for="security-code" class="form-label">* Code de sécurité</label>
              <input v-model.trim="user.securityCode" type="text" class="form-control" id="security-code" required>
              <div class="invalid-feedback">
                Le code de sécurité est obligatoire.
              </div>
            </div>
          </div>
          <div class="row justify-content-md-center">
            <div class="col-md-4">
              <div class="vstack gap-2 mt-4">
                <button class="btn btn-primary d-flex align-items-center justify-content-center" type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check pe-1"
                    viewBox="0 0 16 16">
                    <path
                      d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                  <span class="py-1">S'enregistrer</span>
                </button>
                <RouterLink to="/" class="btn btn-outline-secondary d-flex align-items-center justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                    class="bi bi-backspace pe-2" viewBox="0 0 16 16">
                    <path
                      d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
                    <path
                      d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
                  </svg>
                  <span class="py-1">Retour</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { nextTick } from 'vue';
import { Service } from "../services/services.js";
import { useMessagesStore } from "../stores/messagesStore";
import { mapActions } from "pinia";

export default {
  name: "SignUp",
  data() {
    return {
      user: {
        id: "",
        username: "",
        password: "",
        securityCode: "",
      },
      passwordRepeat: "",
      checkPasswordRepeat: false,
    };
  },
  methods: {
    async submitSignUp($event) {
      let form = $event.target;
      form.classList.add('was-validated');
      this.checkPasswordRepeat = true;
      if (form.checkValidity() && this.user.password === this.passwordRepeat) {
        try {
          await Service.signUp(this.user);
          this.setSuccessMessage("Le compte a bien été créé. Veuillez vous connecter.");
          this.$router.push("/");
        } catch (error) {
          if (error.response.data?.message) {
            this.setErrorMessage(error.response.data.message);
          }
        }
      } else {
        this.setErrorMessage("Certaines données saisies sont manquantes ou incorrectes.");
        nextTick(() => {
          [...document.querySelectorAll(".invalid-feedback")].filter(
            el => getComputedStyle(el, null).display === "block"
          )[0]?.scrollIntoView(false);
        });
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
  }
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>

</style>
