import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [

    { path: '/nodes',         title: 'Nodes',        icon:'nc-tile-56',    class: '' },
    { path: '/calls',         title: 'Calls',        icon:'nc-tile-56',    class: '' },
    { path: '/graph',         title: 'Graph',        icon:'nc-map-big',    class: '' }

];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./side.component.css'],
})

export class SidebarComponent implements OnInit {
    isAdmin: boolean;
    public menuItems: any[];
    constructor(private keycloakService: KeycloakService){}
    ngOnInit() {

        const userRoles: string[] = this.keycloakService.getUserRoles(); //roles extraction
      this.isAdmin = userRoles.includes('admin'); //true/false

        this.menuItems = ROUTES.filter(menuItem => menuItem); //paths added to list
        
        if (this.isAdmin) { //if admin then add in sidebar appear
            this.menuItems.push({
              path: '/addNode',
              title: 'Add Node',
              icon: 'nc-simple-add',
              class: ''
            });
            this.menuItems.push({
                path: '/addCall',
                title: 'Add Call',
                icon: 'nc-simple-add',
                class: ''
              });
            
          }
    }
}
