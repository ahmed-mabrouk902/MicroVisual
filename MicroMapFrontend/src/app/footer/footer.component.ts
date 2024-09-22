import { Component, HostListener, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';



@Component({
    moduleId: module.id,
    selector: 'footer-cmp',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent  {
    isScrolledToBottom: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    
    if (windowBottom >= docHeight) {
      this.isScrolledToBottom = true;
    } else {
      this.isScrolledToBottom = false;
    }
  }

  sendEmail(event: Event) {
    event.preventDefault();
    // You can add your email sending logic here
    console.log('Sending email...');
  }
}
