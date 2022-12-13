<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6 pb-5">
        <h1 class="fs-2 text-center py-3">S'enregistrer</h1>
        <form @submit="submitSignUp" class="row g-3 needs-validation py-3" novalidate>
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
            <input @input="passwordRepeatError = false" v-model.trim="user.password" type="password"
              class="form-control" id="password" required minlength="4">
            <div class="invalid-feedback" :class="{ 'd-none': user.password.length > 0 }">
              Le mot de passe est obligatoire.
            </div>
            <div class="invalid-feedback" :class="{ 'd-none': user.password.length == 0 }">
              Le mot de passe doit comporter au moins 4 caractères.
            </div>
          </div>
          <div class="col-md-6">
            <label for="passwordRepeat" class="form-label">* Veuillez ressaisir le mot de passe</label>
            <input @input="passwordRepeatError = false" v-model="passwordRepeat" type="password" class="form-control"
              id="passwordRepeat" :pattern="passwordRepeatError ? user.password : '.*'" required>
            <div class="invalid-feedback" :class="{ 'd-none': !passwordRepeatError || passwordRepeat.length === 0 }">
              Le mot de passe resaissi doit être identique.
            </div>
            <div class="invalid-feedback" :class="{ 'd-none': passwordRepeat.length > 0 }">
              Le mot de passe doit être resaissi.
            </div>
          </div>
          <div class="col-md-6">
            <label for="security-code" class="form-label">* Code de sécurité</label>
            <input v-model.trim="user.securityCode" type="text" class="form-control" id="security-code" required>
            <div class="invalid-feedback">
              Le code de sécurité est obligatoire.
            </div>
          </div>
          <div class="d-grid d-md-block">
            <button class="btn btn-primary align-items-center d-inline-flex gap-1 ps-1 pe-3" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check"
                viewBox="0 0 16 16">
                <path
                  d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
              S'enregistrer
            </button>
          </div>
        </form>
        <div class="d-grid d-md-block">
          <RouterLink to="/" type="button" class="btn btn-secondary align-items-center d-inline-flex gap-2 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace-fill"
              viewBox="0 0 16 16">
              <path
                d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z" />
            </svg>
            Retour
          </RouterLink>
        </div>
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
      passwordRepeatError: false,
    };
  },
  methods: {
    async submitSignUp($event) {
      $event.preventDefault();
      let form = $event.target;
      form.classList.add('was-validated');
      this.passwordRepeatError = this.passwordRepeat !== this.user.password;
      if (form.checkValidity() && !this.passwordRepeatError) {
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
<style></style>
