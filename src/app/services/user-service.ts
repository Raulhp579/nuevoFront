import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  private enlaceUsuarios: string = 'http://127.0.0.1:8000/api/user';
  private baseUrl: string = 'http://127.0.0.1:8000/api/';

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  verUsuarios(name?: string): Observable<any> {
    const url = name ? `${this.enlaceUsuarios}?name=${name}` : this.enlaceUsuarios;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  crearUsuario(user: any): Observable<any> {
    return this.http.post(this.enlaceUsuarios, user, { headers: this.getHeaders() });
  }

  editarUsuario(id: number, user: any): Observable<any> {
    return this.http.put(`${this.enlaceUsuarios}/${id}`, user, { headers: this.getHeaders() });
  }

  borrarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.enlaceUsuarios}/${id}`, { headers: this.getHeaders() });
  }

  userInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}userInfo`, { headers: this.getHeaders() });
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}time-entries/statistics`, { headers: this.getHeaders() });
  }

  downloadPdf(id: number, month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}getPdf/${id}?month=${month}&year=${year}`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }
}
