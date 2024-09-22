import { Routes } from '@angular/router';



import { CallsComponent } from 'app/pages/calls/calls.component';
import { AddCallComponent } from 'app/pages/add-call/add-call.component';
import { NodesComponent } from 'app/pages/nodes/nodes.component';
import { AddNodeComponent } from 'app/pages/add-node/add-node.component';
import { AuthGuard } from 'app/utility/app.guard';
import { GraphComponent } from 'app/shared/graph/graph.component';


export const AdminLayoutRoutes: Routes = [
   
   
    {path:'calls',component:CallsComponent ,canActivate:[AuthGuard]},
    {path:'addCall',component:AddCallComponent,canActivate:[AuthGuard],data: { roles: ['admin'] }},
    {path:'nodes',component:NodesComponent,canActivate:[AuthGuard]},
    {path:'addNode',component:AddNodeComponent,canActivate:[AuthGuard],data: { roles: ['admin'] }},
    {path:'graph',component:GraphComponent,canActivate:[AuthGuard]},
    

  
];
