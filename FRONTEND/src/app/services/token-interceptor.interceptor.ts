import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Sesión expirada
          this.snackbarService.openSnackBar(GlobalConstants.sessionExpired, GlobalConstants.error);
          sessionStorage.clear();
          this.router.navigate(['/']);
        } else if (error.status === 403) {
          // Acceso denegado
          this.snackbarService.openSnackBar(GlobalConstants.accessDenied, GlobalConstants.error);
          this.router.navigate(['/']);
        }

        return throwError(() => error);
      })
    );
  }
}
