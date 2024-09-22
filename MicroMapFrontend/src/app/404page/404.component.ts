import { Call } from 'app/call';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CallsService } from 'app/calls.service';
import { error } from 'console';
import { FileService } from 'app/file.service';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { Node } from 'app/node';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
    selector: 'notfound',
    moduleId: module.id,
    templateUrl: '404.component.html',
    styleUrls: [],
   
})

export class NotFoundComponent{
    
  }
