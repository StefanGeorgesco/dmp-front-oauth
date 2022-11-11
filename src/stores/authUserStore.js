import { defineStore } from "pinia";

export const useAuthUserStore = defineStore({
  id: "authUser",
  state: () => ({
    _token: "",
    _tokenParsed: {},
    _authenticated: false,
    _realmAccess: {},
  }),
  getters: {
    token: (state) => state._token,
    userId: (state) => state._tokenParsed?.id,
    username: (state) => state._tokenParsed?.preferred_username,
    isAuthenticated: (state) => state._authenticated,
    role: (state) =>
      state._realmAccess?.roles.filter((role) =>
        ["ADMIN", "DOCTOR", "PATIENT"].includes(role)
      )[0],
  },
  actions: {
    initAuth() {
      this.updateAuth();
      if (this._authenticated) {
        setInterval(() => {
          this.keycloak
            .updateToken(import.meta.env.VITE_KEYCLOAK_TOKEN_MIN_VALIDITY)
            .then((refreshed) => {
              if (refreshed) {
                this.updateAuth();
              }
            })
            .catch(() => {
              console.error("User authentication token refresh failed");
            });
        }, import.meta.env.VITE_KEYCLOAK_TOKEN_REFRESH_PERIOD * 1000);
      }
    },
    updateAuth() {
      this._token = this.keycloak.token;
      this._tokenParsed = this.keycloak.tokenParsed;
      this._authenticated = this.keycloak.authenticated;
      this._realmAccess = this.keycloak.realmAccess;
    },
    login() {
      this.keycloak.login({
        redirectUri: window.location.origin + import.meta.env.BASE_URL,
      });
      this.updateAuth();
    },
    logout() {
      this.keycloak.logout({
        redirectUri: window.location.origin + import.meta.env.BASE_URL,
      });
      this.updateAuth();
    },
  },
});
