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
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.httpClient.post(`${this.url}/category/add`, data, { headers });
  }

  update(data: any) {
    const token = sessionStorage.getItem('token'); // Obtener el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Agregar token al header
    });
  
    return this.httpClient.patch(`${this.url}/category/update`, data, { headers });
  }
  

  getCategorys() {
    const token = sessionStorage.getItem('token'); // Obtener el token desde sessionStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Agregar el token al header
    });

    return this.httpClient.get(`${this.url}/category/get`, { headers });
  }

  // AUN SIN IMPLEMENTAR
  getFilteredCategories() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.httpClient.get(`${this.url}/category/getAllCategories?filterValue=true`, { headers });
  }
}
