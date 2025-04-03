import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }
}
