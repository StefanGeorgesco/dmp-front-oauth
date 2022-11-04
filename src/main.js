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
  .init({ onLoad: initOptions.onLoad })
  .then((auth) => {
    if (!auth) {
      console.log("Not authenticated");
      console.log(keycloak);
    } else {
      console.log("Authenticated");
      console.log(keycloak);
    }

    const app = createApp(App);
    app.provide("keycloak", keycloak);
    app.use(pinia);
    app.use(router);
    app.mount("#app");

    //Token Refresh
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
