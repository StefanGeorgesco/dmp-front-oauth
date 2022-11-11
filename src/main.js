import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Keycloak from "keycloak-js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

let keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
});

let pinia = createPinia();
pinia.use(() => ({ keycloak }));

keycloak
  .init({
    onLoad: "check-sso",
    silentCheckSsoRedirectUri:
      window.location.origin +
      import.meta.env.BASE_URL +
      "silent-check-sso.html",
  })
  .then(() => {
    const app = createApp(App);
    app.use(pinia);
    app.use(router);
    app.mount("#app");
  })
  .catch(() => {
    console.error("User authentication failed");
  });
