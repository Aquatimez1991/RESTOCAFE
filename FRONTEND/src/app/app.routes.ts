import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { RouteGuardService } from "./services/route-guard.service";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent 
  },
  {
    path: 'cafe',
    component: FullComponent, 
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.DashboardComponent),  
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] }
      },
      {
        path: 'category',
        loadComponent: () => import('./material-component/manage-category/manage-category.component')
          .then(m => m.ManageCategoryComponent), 
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin'] }
      },
      {
        path: 'product',
        loadComponent: () => import('./material-component/manage-product/manage-product.component')
          .then(m => m.ManageProductComponent),
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin'] }
      },
      {
        path: 'order',
        loadComponent: () => import('./material-component/manage-order/manage-order.component')
          .then(m => m.ManageOrderComponent),
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] }
      },
      {
        path: 'bill',
        loadComponent: () => import('./material-component/view-bill/view-bill.component')
          .then(m => m.ViewBillComponent),
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] }
      },
      {
        path: 'user',
        loadComponent: () => import('./material-component/manage-user/manage-user.component')
          .then(m => m.ManageUserComponent),
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '' 
  }
];
