import { defineStore } from "pinia";

export const useAuthUserStore = defineStore({
  id: "authUser",
  getters: {
    token: (state) => state.keycloak.token,
    userId: (state) => state.keycloak.tokenParsed?.id,
    username: (state) => state.keycloak.tokenParsed?.preferred_username,
    isAuthenticated: (state) => state.keycloak.authenticated,
    role: (state) =>
      state.keycloak.realmAccess?.roles.filter((role) =>
        ["ADMIN", "DOCTOR", "PATIENT"].includes(role)
      )[0],
  },
  actions: {
    login() {
      this.keycloak.login({ redirectUri: "http://localhost:5173/main" });
    },
    logout() {
      this.keycloak.logout({ redirectUri: "http://localhost:5173/" });
    },
  },
});
