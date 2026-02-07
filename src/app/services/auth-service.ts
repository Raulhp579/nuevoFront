import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  role = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.role.set(localStorage.getItem('role'));
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.enlace}/register`, user, { headers: this.getHeaders() });
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.enlace}/login`, user, { headers: this.getHeaders() });
  }

  logOut(): Observable<any> {
    this.clearRole();
    return this.http.delete(`${this.enlace}/logOut`, { headers: this.getHeadersConToken() });
  }

  user(): Observable<any> {
    return this.http.get(`${this.enlace}/userInfo`, { headers: this.getHeadersConToken() });
  }

  setRole(role: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('role', role);
    }
    this.role.set(role);
  }

  clearRole() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('role');
      localStorage.removeItem('token'); // Also clear token here for consistency
    }
    this.role.set(null);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.enlace}/change-password`, data, {
      headers: this.getHeadersConToken(),
    });
  }
}
