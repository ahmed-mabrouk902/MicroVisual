
import { environment } from 'environments/environment.prod';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
      keycloak.init({
        config: {
          url: environment.keycloakUrl,
          realm: environment.realm,
          clientId: environment.clientId,
          

          
        },
        
        initOptions: {
         
          onLoad: 'check-sso',
        checkLoginIframe: false,
        enableLogging: true,
         // Include user profile including roles
       
        },
        loadUserProfileAtStartUp: true

        
      });
  }