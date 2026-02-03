import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private enlaceUsuarios: string = 'http://127.0.0.1:8000/api/user';
  private baseUrl: string = 'http://127.0.0.1:8000/api/';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  verUsuarios(): Observable<any> {
    return this.http.get(this.enlaceUsuarios, { headers: this.getHeaders() });
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
}
