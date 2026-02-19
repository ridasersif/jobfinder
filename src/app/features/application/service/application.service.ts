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

  getApplicationsByUserId(userId: string) {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
  }

  updateApplicationStatus(id: string, status: 'pending' | 'accepted' | 'rejected') {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, {
      status,
      statusUpdated: new Date().toISOString()
    });
  }

  deleteApplication(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }









}
