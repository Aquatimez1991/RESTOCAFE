import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importar Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { HeaderComponent } from './full/header/header.component';
import { SidebarComponent } from './full/sidebar/sidebar.component';
import { FullComponent } from './full/full.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FullComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,  // ✅ Agregado
    MatIconModule,  // ✅ Agregado
    MatButtonModule // ✅ Agregado
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FullComponent
  ]
})
export class LayoutsModule {}
