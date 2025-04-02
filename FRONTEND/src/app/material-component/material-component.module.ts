import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponentRoutingModule } from './material-component-routing.module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component'; // ✅ Importación directa
import { OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router'; 
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
export class MaterialComponentModule implements OnInit {

    constructor(private userService: UserService, private router: Router) {}
  
    ngOnInit(): void {
      const token = sessionStorage.getItem('token');
      if (token) {
        this.userService.checkToken().subscribe(
          () => {
            console.log('Sesión válida');
          },
          () => {
            console.error('Sesión inválida o expirada');
            sessionStorage.clear();
            this.router.navigate(['/']); // Redirigir al home si no hay sesión válida
          }
        );
      }
    }
}
