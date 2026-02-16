import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:3000/applications';
  constructor(private http: HttpClient) { }

  addApplication(application: Application) {
    return this.http.post<Application>(this.apiUrl, application)
  }









}
