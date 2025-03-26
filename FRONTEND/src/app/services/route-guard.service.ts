import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      const tokenPayload: any = jwtDecode(token);
      const roles = route.data['expectedRole'];
      if (!roles.includes(tokenPayload.role)) {
        this.router.navigate(['/']);
        return false;
      }
    } catch (error) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
