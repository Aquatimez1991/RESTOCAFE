import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiURL = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  getDetails(): Observable<any> {
    const token = sessionStorage.getItem('token'); // Recupera el token desde el almacenamiento local
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiURL}/dashboard/details`, { headers });
  }
}
