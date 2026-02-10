import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-job-info',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './job-info.component.html',
  styleUrl: './job-info.component.scss'
})
export class JobInfoComponent implements OnInit {
  job: Job | null = null;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchJobDetails(slug);
      }
    });
  }

  fetchJobDetails(slug: string): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (response) => {
        const foundJob = response.data.find(j => j.slug === slug);
        this.job = foundJob || null;
        this.isLoading = false;

       
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Error fetching job details:', err);
        this.isLoading = false;
      }
    });
  }
}
