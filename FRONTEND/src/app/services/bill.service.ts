import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private readonly url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private buildUrl(endpoint: string): string {
    return `${this.url}/bill/${endpoint}`;
  }

  generateReport(data: any): Observable<any> {
    return this.httpClient.post(this.buildUrl('generateReport'), data, {
      headers: this.getHeaders()
    });
  }

  getPdf(data: any): Observable<Blob> {
    return this.httpClient.post(this.buildUrl('getPdf'), data, {
      responseType: 'blob',
      headers: this.getHeaders()
    });
  }

  getBills(): Observable<any> {
    return this.httpClient.post(this.buildUrl('getBills'), {}, {
      headers: this.getHeaders()
    });
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(this.buildUrl(`delete/${id}`), {
      headers: this.getHeaders()
    });
  }
}
