import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TimeEntrieService {
  private enlace: string = 'http://127.0.0.1:8000/api/timeEntrie';
  private baseUrl: string = 'http://127.0.0.1:8000/api';

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  getTimeEntries(): Observable<any> {
    return this.http.get(this.enlace, { headers: this.getHeaders() });
  }

  createTimeEntrie(timeEntrie: any): Observable<any> {
    return this.http.post(this.enlace, timeEntrie, { headers: this.getHeaders() });
  }

  updateTimeEntrie(id: number, timeEntrie: any): Observable<any> {
    return this.http.put(`${this.enlace}/${id}`, timeEntrie, { headers: this.getHeaders() });
  }

  deleteTimeEntrie(id: number): Observable<any> {
    return this.http.delete(`${this.enlace}/${id}`, { headers: this.getHeaders() });
  }

  getTimeEntrieById(id: number): Observable<any> {
    return this.http.get(`${this.enlace}/${id}`, { headers: this.getHeaders() });
  }

  createWithAuth(location:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/clock_in_out`,location, { headers: this.getHeaders() });
  }

  take3(): Observable<any> {
    return this.http.get(`${this.baseUrl}/takeThree`, { headers: this.getHeaders() });
  }
}
