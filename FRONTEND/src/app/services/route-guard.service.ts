import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../shared/global-constants'; // ✅ Importamos GlobalConstants

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

// ✅ Eliminamos el método isAuthenticated() y lo reemplazamos por el método canActivate()
/*    isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenPayload: any = jwtDecode(token);
      return !!tokenPayload;
    } catch (error) {
      return false;
    }
  }
*/
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/']);
      return false;
    }

    if (!this.authService.isAuthenticated()) {
      this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
      this.router.navigate(['/']);
      return false;
    }

    try {
      const tokenPayload: any = jwtDecode(token);
      const roles = route.data['expectedRole'] || [];

      // Convertimos los roles a minúsculas para evitar errores de comparación
      const userRole = tokenPayload.role?.toLowerCase();
      const validRoles = roles.map((role: string) => role.toLowerCase());

      if (!validRoles.includes(userRole)) {
        this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
        this.router.navigate(['/']);
        return false;
      }

    } catch (error) {
      this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
