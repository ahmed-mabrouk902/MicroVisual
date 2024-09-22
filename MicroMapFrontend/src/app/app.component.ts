import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoadingService } from './LoadingPage/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private loadingService: LoadingService) { }
appear:boolean=false;
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
        setTimeout(() => { 
          this.appear= true;
          this.loadingService.hide();
        }, 1500); // Hide after 1.5 seconds
      } 
    });
  }
}