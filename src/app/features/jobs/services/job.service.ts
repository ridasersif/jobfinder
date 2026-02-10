import { Job } from './../models/job.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://www.arbeitnow.com/api/job-board-api';

  getAllJobs() : Observable<{ data: Job[] }> {
    return this.http.get<{ data: Job[] }>(this.apiUrl);
  }
}
