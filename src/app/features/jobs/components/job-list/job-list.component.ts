import { SearchService } from './../../../../core/services/search.service';
import { ToastService } from './../../../../core/services/toast.service';
import { JobService } from './../../services/job.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Job } from '../../models/job.model';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';

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
  isLoading: boolean = true;

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.fetchJobs();

    this.route.firstChild?.paramMap.subscribe(params => {
      this.selectedJobSlug = params.get('slug');
    });

    // Observe search and location changes from Navbar
    combineLatest([
      this.searchService.searchQuery$,
      this.searchService.locationQuery$
    ]).subscribe(([search, location]) => {
      this.filterJobs(search, location);
    });
  }

  fetchJobs(): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (response) => {
        this.jobs = response.data;
        
        this.filterJobs(
          this.searchService.getSearchQueryValue(),
          this.searchService.getLocationQueryValue()
        );
        this.isLoading = false;

        // If we are on /jobs and no child is selected, select the first one on desktop
        if (!this.selectedJobSlug && this.filteredJobs.length > 0 && window.innerWidth > 768) {
          this.selectJob(this.filteredJobs[0].slug);
        }
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.isLoading = false;
        this.toastService.show('Failed to load jobs. Please try again later.');
      }
    });
  }


  selectJob(slug: string): void {
    this.selectedJobSlug = slug;
    this.router.navigate(['/jobs', slug]);
  }


  filterJobs(search: string, location: string): void {
    const s = search.toLowerCase();
    const l = location.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (job.title.toLowerCase().includes(s) || job.company_name.toLowerCase().includes(s)) &&
      (job.location.toLowerCase().includes(l))
    );
  }
}
