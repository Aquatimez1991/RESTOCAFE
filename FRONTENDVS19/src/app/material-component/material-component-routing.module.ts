import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';

const routes: Routes = [
  { path: 'view-bill-products', component: ViewBillProductsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialComponentRoutingModule {}
