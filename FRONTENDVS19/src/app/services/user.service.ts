import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl; 
  constructor(private httpClient: HttpClient) { }
  signup(data: any) {
    return this.httpClient.post(
      this.url + '/user/signup',
      data, // The data to be sent in the request body.
      { headers: new HttpHeaders().set('Content-Type', 'application/json') } // Ensure JSON content type.
    );
  }

  forgotPassword(data: any) {
    return this.httpClient.post(
      this.url + "/user/forgotPassword",
      data,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  login(data: any) {
    return this.httpClient.post(
      this.url + "/user/login",
      data,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  checkToken() {
    this.httpClient.get(this.url + "/user/checkToken");  // TODO: Implemented that API in the backend
  }

  changePassword(data: any) {
    return this.httpClient.post(
      this.url + "/user/changePassword/",
      data,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  getUsers() {
    return this.httpClient.get(this.url + "/user/getAllUsers");
  }

  update(data: any) {
    return this.httpClient.post(
      this.url + '/user/update',
      data,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }
}
