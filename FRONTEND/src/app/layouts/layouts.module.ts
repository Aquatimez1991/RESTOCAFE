import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

// Componentes standalone
import { AppSidebarComponent } from '../layouts/full/sidebar/sidebar.component';
import { AppHeaderComponent } from '../layouts/full/header/header.component';
import { FullComponent } from '../layouts/full/full.component';

@Component({
  selector: 'app-layouts',
  standalone: true,
  template: `<app-full-layout></app-full-layout>`, // Envuelve FullComponent
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    AppHeaderComponent,
    AppSidebarComponent,
    FullComponent 
  ],
})
export class LayoutsComponent {}
