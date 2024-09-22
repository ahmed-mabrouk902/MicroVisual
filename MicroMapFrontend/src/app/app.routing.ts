import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './homepage/home.component';
import { NotFoundComponent } from './404page/404.component';
import { GraphComponent } from './shared/graph/graph.component';

export const AppRoutes: Routes = [{path:'home',component:HomeComponent},{path:'Error_404',component:NotFoundComponent},
  {
    path: '',
    redirectTo: 'nodes',
    pathMatch: 'full',
  },
   {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
  }]},
  {
    path:'**',
    redirectTo: 'Error_404'
  }
]
