import { Component, OnInit, Renderer2, ViewChild, ElementRef, NgModule } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
// import { databaseSwitch } from './databaseSwitch.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { GraphComponent } from '../graph/graph.component';
import { HttpClient } from 'selenium-webdriver/http';
import { EmailService } from './email.service';
import Swal from 'sweetalert2';
@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styles: [`
      .feedback-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
    `]
    
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    isLoggedIn: boolean | undefined;


    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location:Location, private renderer : Renderer2, private element : ElementRef, private router: Router,private keycloakService:KeycloakService,                   private feedbackService:EmailService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

        
    }

//feedback
showForm = false;
  feedback = { name: '', message: '' };
  // openFeedbackForm() {
  //   this.showForm = true;
  // }

  closeFeedbackForm() {
    this.showForm = false;
  }

  submitFeedback() {
    this.feedback.name=this.username;

    this.feedbackService.sendFeedback(this.feedback).subscribe({
      next: (response) => {
        
        
      },
      error: (error) => {
        Swal.fire({icon: 'success',title: 'Sent!',text: `your feedback has been sent!`});
        this.closeFeedbackForm();
      }
    });
    
  }
//feedback

    email:string;
    username:string;

    async ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
       this.isLoggedIn = await this.keycloakService.isLoggedIn();
      this.email = (await this.keycloakService.loadUserProfile()).email;
      this.username = (await this.keycloakService.loadUserProfile()).username;



      // switch
      // this.loadDatabases();

    }




    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

              sidebarToggle() {
                  if (this.sidebarVisible === false) {
                      this.sidebarOpen();
                  } else {
                      this.sidebarClose();
                  }
                }
                      sidebarOpen() {
                          const toggleButton = this.toggleButton;
                          const html = document.getElementsByTagName('html')[0];
                          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
                          setTimeout(function(){
                              toggleButton.classList.add('toggled');
                          }, 500);

                          html.classList.add('nav-open');
                          if (window.innerWidth < 991) {
                            mainPanel.style.position = 'fixed';
                          }
                          this.sidebarVisible = true;
                      };

                              sidebarClose() {
                                  const html = document.getElementsByTagName('html')[0];
                                  const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
                                  if (window.innerWidth < 991) {
                                    setTimeout(function(){
                                      mainPanel.style.position = '';
                                    }, 500);
                                  }
                                  this.toggleButton.classList.remove('toggled');
                                  this.sidebarVisible = false;
                                  html.classList.remove('nav-open');
                              };

                                      collapse(){
                                        this.isCollapsed = !this.isCollapsed;
                                        const navbar = document.getElementsByTagName('nav')[0];
                                        console.log(navbar);
                                        if (!this.isCollapsed) {
                                          navbar.classList.remove('navbar-transparent');
                                          navbar.classList.add('bg-white');
                                        }else{
                                          navbar.classList.add('navbar-transparent');
                                          navbar.classList.remove('bg-white');
                                        }


                                      }
     
      logout(): void {
        this.keycloakService.logout('http://localhost:4200/home');
      }

    //  switchdb
    // databases: string[] = [];
    // selectedDatabase: string = '';
    


    // loadDatabases(): void {
    //   this.neo4jService.getDatabases().subscribe(
    //     data => {
    //       this.databases = data;
    //     },
    //     error => {
    //       console.error('Error retrieving databases', error);
    //     }
    //   );
    // }
  
    // switchDatabase(): void {
    //   if (this.selectedDatabase) {
    //     this.graphComponent.changeCypherQuery(`:use ${this.selectedDatabase}`)
    //   }
    // }
}
