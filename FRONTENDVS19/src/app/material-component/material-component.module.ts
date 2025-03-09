import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponentRoutingModule } from './material-component-routing.module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component'; // ✅ Importación directa

// Importar módulos de Angular Material necesarios
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialComponentRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ViewBillProductsComponent // ✅ Se agrega en imports en lugar de declarations
  ]
})
export class MaterialComponentModule {}
