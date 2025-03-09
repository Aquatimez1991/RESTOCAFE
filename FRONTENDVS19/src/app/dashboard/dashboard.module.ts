import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component'; // ✅ Importación correcta

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DashboardComponent // ✅ Se importa aquí en lugar de declararlo
  ]
})
export class DashboardModule {}
