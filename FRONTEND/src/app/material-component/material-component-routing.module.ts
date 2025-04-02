import { RouterModule, Routes } from '@angular/router';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

const routes: Routes = [
  { path: 'view-bill-products', component: ViewBillProductsComponent },
  {
    path: 'category',
    component: ManageCategoryComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'] // Categories tab viewable only to admins
    }
  },
  {
    path: 'product',
    component: ManageProductComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'] // Products tab viewable only to admins
    }
  },
  {
    path: 'order',
    component: ManageOrderComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'] // Orders tab viewable to both admins and users
    }
  },
  {
    path: 'bill',
    component: ViewBillComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'] // Bills tab viewable to both admins and users
    }
  },
  {
    path: 'user',
    component: ManageUserComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'] // Users tab viewable only to admins
    }
  }
];

// Export the routes standalone as a constant
export const MaterialComponentRoutingModule = RouterModule.forChild(routes);