/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from "@angular/core";
import KeycloakService from "../services/keycloak/keycloakservice";

export default async function initKeycloak(){
    const keycloak = inject(KeycloakService).getKeycloak();
    keycloak.onReady = (authenticated) => {
            console.log(`Success authentication ${authenticated}`);
        };

    const iab = (window as any).cordova?.InAppBrowser;

    if (iab) {
      const originalOpen = iab.open.bind(iab);

      iab.open = (...args: any[]) => {
        const ref = originalOpen(...args);

        ref?.addEventListener('loaderror', (event: any) => {
          const details = {
            url: event.url?.split(/[?#]/)[0],
            code: event.code,
            message: event.message,
          };

          console.error('InAppBrowser loaderror:', details);

          window.alert(JSON.stringify(details, null, 2));
        });

        return ref;
      };
    }

    await keycloak.init({
      onLoad: 'login-required',
      flow: 'hybrid',
      scope: 'profile basic',
      checkLoginIframe: false,
    });
}
