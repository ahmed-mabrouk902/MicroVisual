import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatPaginatorModule } from '@angular/material/paginator';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { CallsComponent } from 'app/pages/calls/calls.component';
import { AddCallComponent } from 'app/pages/add-call/add-call.component';
import { NodesComponent } from 'app/pages/nodes/nodes.component';
import { AddNodeComponent } from 'app/pages/add-node/add-node.component';
import { GraphComponent } from 'app/shared/graph/graph.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { databaseSwitch } from 'app/shared/navbar/databaseSwitch.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    MatAutocompleteModule,
    MatInputModule,
    MatPaginatorModule,
    BrowserModule,
    
    ReactiveFormsModule,
  ],
  declarations: [
    CallsComponent,
    AddCallComponent,
    NodesComponent,
    AddNodeComponent,
    GraphComponent
  ]
})
export class AdminLayoutModule { }
