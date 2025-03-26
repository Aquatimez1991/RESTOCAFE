import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RouteGuardService } from './services/route-guard.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] }
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

export class AppRoutingModule { }