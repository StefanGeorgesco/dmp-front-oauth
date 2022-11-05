import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Keycloak from "keycloak-js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import initOptions from "../keycloak.init.options";

let keycloak = new Keycloak(initOptions);
let pinia = createPinia();
pinia.use(() => ({ keycloak }));

keycloak
  .init({
    onLoad: "check-sso",
    checkLoginIframe: false,
  })
  .then((auth) => {
    if (!auth) {
      console.log("Not authenticated on keycloak init");
    } else {
      console.log("Authenticated on keycloak init");
    }
    console.log(keycloak);

    const app = createApp(App);
    app.use(pinia);
    app.use(router);
    app.mount("#app");

    setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.log("Token refreshed");
          } else {
            console.log(
              "Token not refreshed, valid for " +
                Math.round(
                  keycloak.tokenParsed.exp +
                    keycloak.timeSkew -
                    new Date().getTime() / 1000
                ) +
                " seconds"
            );
          }
        })
        .catch(() => {
          console.error("Failed to refresh token");
        });
    }, 60000);
  })
  .catch(() => {
    console.error("Authenticated Failed");
  });
