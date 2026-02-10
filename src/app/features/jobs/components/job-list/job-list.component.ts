import { JobService } from './../../services/job.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-job-list',
  imports: [],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    console.log('JobListComponent initialized');
    this.jobService.getAllJobs().subscribe(response => {
      console.log(response.data);
    });
  }
}
