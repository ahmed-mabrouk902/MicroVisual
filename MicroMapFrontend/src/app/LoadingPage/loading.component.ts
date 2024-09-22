import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';


@Component({
    moduleId: module.id,
    selector: 'loading',
    templateUrl: 'loading.component.html',
    styleUrls:['loading.css']
})

export class LoadingComponent implements OnInit {
    loading = false;
  
    constructor(private loadingService: LoadingService) { }
  
    ngOnInit() {
      this.loadingService.loading$.subscribe((isLoading) => {
        this.loading = isLoading;
      });
    }
  }