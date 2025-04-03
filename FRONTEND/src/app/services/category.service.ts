import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  add(data: any) {
    return this.httpClient.post(`${this.url}/category/add`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(data: any) {
    return this.httpClient.patch(`${this.url}/category/update`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getCategorys() {
    const token = sessionStorage.getItem('token'); // Obtener el token desde sessionStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Agregar el token al header
    });

    return this.httpClient.get(`${this.url}/category/get`, { headers });
  }
}
