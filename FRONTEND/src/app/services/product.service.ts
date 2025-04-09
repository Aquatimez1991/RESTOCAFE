import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  add(data: any) {
    return this.httpClient.post(`${this.url}/product/add`, data, {
      headers: this.getHeaders(),
    });
  }

  update(data: any) {
    return this.httpClient.patch(`${this.url}/product/update`, data, {
      headers: this.getHeaders(),
    });
  }

  getProducts() {
    return this.httpClient
      .get<any>(`${this.url}/product/get`, { headers: this.getHeaders() })
      .pipe(map(res => res.data)); // Extrae solo el array `data`
  }

  updateStatus(data: any) {
    return this.httpClient.patch(`${this.url}/product/updateStatus`, data, {
      headers: this.getHeaders(),
    });
  }

  delete(id: any) {
    return this.httpClient.delete(`${this.url}/product/delete/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getProductsByCategory(id: any) {
    return this.httpClient.get(`${this.url}/product/getByCategory/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getById(id: any) {
    return this.httpClient.get(`${this.url}/product/getByID/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
