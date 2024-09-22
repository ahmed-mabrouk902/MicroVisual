import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  animations: [
    trigger('scrollAnimation', [
      state('scrolled', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('notScrolled', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      transition('notScrolled => scrolled', [
        animate('0.5s ease-out')
      ]),
      transition('scrolled => notScrolled', [
        animate('0.5s ease-in')
      ])
    ])
  ]
})
export class AdminLayoutComponent {
  currentUrl: string = ''; // Variable to hold the current URL
test: boolean=true;

isLoggedIn: Promise<boolean>;
  constructor(private router: Router, private keycloakService:KeycloakService) {
        this.isLoggedIn=keycloakService.isLoggedIn();

    // Initialize currentUrl with the initial URL
    this.currentUrl = this.router.url;

    // to appear graph on only nodes and calls
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log('Current URL:', this.currentUrl); // Log the current URL whenever it changes
        
        if(this.currentUrl=="/addNode"||this.currentUrl=="/addCall"){
          this.test=false;

          
        }else{
          this.test=true;
        }
      }
    });
  }


  isVisible = true;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop) {
      // Scrolling down
      this.isVisible = false;
    } else {
      // Scrolling up
      this.isVisible = true;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }
}
