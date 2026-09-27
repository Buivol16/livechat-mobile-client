import { inject } from "@angular/core";
import KeycloakService from "../services/keycloak/keycloakservice";

export default async function initKeycloak(){
    const keycloak = inject(KeycloakService).getKeycloak();
    keycloak.onReady = (authenticated) => {
            console.log(`Success authentication ${authenticated}`);
        };
    await keycloak.init({
      onLoad: 'login-required',
      flow: 'hybrid',
      scope: 'profile basic',
      checkLoginIframe: false,
    });
}
