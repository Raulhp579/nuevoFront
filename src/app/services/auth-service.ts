import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private enlace: string = 'http://127.0.0.1:8000/api';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private getHeadersConToken(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.enlace}/register`, user, { headers: this.getHeaders() });
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.enlace}/login`, user, { headers: this.getHeaders() });
  }

  logOut(): Observable<any> {
    return this.http.delete(`${this.enlace}/logOut`, { headers: this.getHeadersConToken() });
  }

  user(): Observable<any> {
    return this.http.get(`${this.enlace}/userInfo`, { headers: this.getHeadersConToken() });
  }
}
