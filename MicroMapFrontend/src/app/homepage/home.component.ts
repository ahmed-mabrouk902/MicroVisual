
import { Component, OnInit, ViewChild } from '@angular/core';

import { KeycloakEventType, KeycloakService } from 'keycloak-angular';



@Component({
    selector: 'home',
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['nicepage.css','Home.css'],
   
})

export class HomeComponent implements OnInit {
    isAuthenticated: boolean = false;
  
    constructor(private keycloakService: KeycloakService) {}
  
    ngOnInit(): void {
      this.checkAuthentication();
      this.keycloakService.keycloakEvents$.subscribe(event => {
        this.checkAuthentication();
      });
    }
  
    private async checkAuthentication(): Promise<void> {
      this.isAuthenticated = await this.keycloakService.isLoggedIn();
    }
  
    // logout(): void {
    //   this.keycloakService.logout('http://localhost:4200/home');
    // }
  }
