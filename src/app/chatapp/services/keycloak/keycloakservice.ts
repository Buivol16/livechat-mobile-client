import { Injectable } from "@angular/core";
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export default class KeycloakService {
  private readonly keycloak: Keycloak = new Keycloak({
    url: `https://${window.location.hostname}:8443`,
    realm: 'livechat',
    clientId: 'front-app',
  });

  logout() {
    console.log('Logouting with keycloak');
    this.keycloak.logout();
  }

  login() {
    console.log('Authenticating with keycloak');
    this.keycloak.login();
  }

  getToken() {
    console.log('Getting token');
    return 'Bearer ' + this.keycloak.token;
  }

  getKeycloak() {
    return this.keycloak;
  }
}
