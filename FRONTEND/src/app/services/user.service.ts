import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  checkToken(): Observable<any> {
    return this.http.get(`${this.apiURL}/user/checkToken`);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/login`, data);
  }

  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/signup`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/forgotPassword`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/changePassword`, data);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiURL}/user/get`);
  }

  update(data: any): Observable<any> {
    return this.http.patch(`${this.apiURL}/user/update`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.patch(`${this.apiURL}/user/resetPassword`, data);
  }
}
