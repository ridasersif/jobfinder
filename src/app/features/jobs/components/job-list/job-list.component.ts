import { JobService } from './../../services/job.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Job } from '../../models/job.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  selectedJobSlug: string | null = null;
  searchQuery: string = '';
  locationQuery: string = '';
  isLoading: boolean = true;

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchJobs();

    // Watch for route changes to highlight the selected job
    this.route.firstChild?.paramMap.subscribe(params => {
      this.selectedJobSlug = params.get('slug');
    });
  }

  fetchJobs(): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (response) => {
        this.jobs = response.data;
        this.filteredJobs = [...this.jobs];
        this.isLoading = false;

        // If we are on /jobs and no child is selected, select the first one on desktop
        if (!this.selectedJobSlug && this.filteredJobs.length > 0 && window.innerWidth > 768) {
          this.selectJob(this.filteredJobs[0].slug);
        }
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.isLoading = false;
      }
    });
  }

  selectJob(slug: string): void {
    this.selectedJobSlug = slug;
    this.router.navigate(['/jobs', slug]);
  }

  onSearch(): void {
    this.filteredJobs = this.jobs.filter(job =>
      (job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (job.location.toLowerCase().includes(this.locationQuery.toLowerCase()))
    );
  }
}
