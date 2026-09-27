/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import KeycloakService from '../services/keycloak/keycloakservice';

export function addAuthorizationHeaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const keycloakService = inject(KeycloakService);

  // Clone the request to add the new header
  const clonedRequest = req.clone({
    headers: req.headers.append('Authorization', keycloakService.getToken()),
  });

  // Pass the cloned request instead of the original request to the next handle
  return next(clonedRequest);
}
