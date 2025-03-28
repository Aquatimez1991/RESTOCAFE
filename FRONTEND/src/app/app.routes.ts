import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RouteGuardService } from './services/route-guard.service';
import { importProvidersFrom } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component'; // ✅ Importa el componente

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent, // ✅ Usamos el componente directamente
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] }
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
