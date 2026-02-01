import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeEntrieService {

  private enlace:string = "http://127.0.0.1:8000/api/timeEntrie"

  private getHeaders():HttpHeaders{
    const token = localStorage.getItem("token")
    return new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*'
    })

  }

  constructor(private http:HttpClient){}


  getTimeEntries():Observable<any>{
    return this.http.get(this.enlace,{headers:this.getHeaders()})
  }

  createTimeEntrie(timeEntrie:any):Observable<any>{
    return this.http.post(this.enlace,timeEntrie,{headers:this.getHeaders()})
  }

  updateTimeEntrie(id:number, timeEntrie:any):Observable<any>{
    return this.http.put(`${this.enlace}/${id}`,timeEntrie,{headers:this.getHeaders()})
  }

  deleteTimeEntrie(id:number):Observable<any>{
    return this.http.delete(`${this.enlace}/${id}`,{headers:this.getHeaders()})
  }

  getTimeEntrieById(id:number):Observable<any>{
    return this.http.get(`${this.enlace}/${id}`,{headers:this.getHeaders()})
  }
}