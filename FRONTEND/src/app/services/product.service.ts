import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.apiUrl; // Base URL for API endpoints

  constructor(private httpClient: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Add the token to the header
    });
  }

  // Agregar un nuevo producto
  add(data: any) {
    return this.httpClient.post(
      `${this.url}/product/add`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Actualizar un producto existente
  update(data: any) {
    return this.httpClient.post(
      `${this.url}/product/update`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Obtener todos los productos
  getProducts() {
    return this.httpClient.get(
      `${this.url}/product/get`,
      { headers: this.getHeaders() }
    );
  }

  // Actualizar el estado de un producto (por ejemplo, activar o desactivar)
  updateStatus(data: any) {
    return this.httpClient.post(
      `${this.url}/product/updateStatus`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Eliminar un producto
  delete(id: any) {
    return this.httpClient.post(
      `${this.url}/product/delete/:id=${id}`,
      {}, // Empty body since the productId is sent as a query parameter
      { headers: this.getHeaders() }
    );
  }

  // Obtener los productos de una categoría específica
  getProductsByCategory(id: any) {
    return this.httpClient.get(
      `${this.url}/product/getByCategory/:id`,
      {
        params: { categoryId: id },
        headers: this.getHeaders(),
      }
    );
  }

  // Obtener los detalles de un producto específico
  getById(id: any) {
    return this.httpClient.get(
      `${this.url}/product/getByID/:id`,
      {
        params: { productId: id },
        headers: this.getHeaders(),
      }
    );
  }
}
