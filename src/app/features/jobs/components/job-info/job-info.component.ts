import { Favorite } from './../../../favorite/models/favorite.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../../core/services/auth.service';
import { FavoriteService } from '../../../favorite/services/favorites.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as FavoritesActions from '../../../favorite/state/favorites.actions';
import * as FavoritesSelectors from '../../../favorite/state/favorites.selectors';
import { Application } from '../../../application/models/application.model';
import * as ApplicationsActions from '../../../application/application/state/applications.actions';

@Component({
  selector: 'app-job-info',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './job-info.component.html',
  styleUrl: './job-info.component.scss'
})
export class JobInfoComponent implements OnInit {

  isLoggedIn = false;
  job: Job | null = null;
  isLoading: boolean = false;
  currentUserId: number | null = null;
  showLoginModal = false;
  isFavorited: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    })

    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchJobDetails(slug);
      }
    });

    this.store
    .select(FavoritesSelectors.selectAllFavorites)
    .subscribe(favorites => {
      if(!this.job) return;
      this.isFavorited = favorites.some(
        fav => fav.slug === this.job?.slug
      )
    });


  }

  fetchJobDetails(slug: string): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (response) => {
        const foundJob = response.data.find(j => j.slug === slug);

        this.job = foundJob || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching job details:', err);
        this.isLoading = false;
      }

    });
  }

  addToFavorite(): void {

    if (!this.job || !this.isLoggedIn || !this.currentUserId) return;

    const favorite: Favorite = {
      userId: this.currentUserId,
      slug: this.job.slug,
      title: this.job.title,
      company: this.job.company_name,
      location: this.job.location,
    };

    this.store.dispatch(
      FavoritesActions.addFavorite({ favorite })
    );
  }

  handleFavoriteClick() {
    if (!this.isLoggedIn) {
      this.showLoginModal = true;
      return;
    }
    this.addToFavorite();
  }

  addToApplication() {
    if (!this.job || !this.isLoggedIn || !this.currentUserId) return;
    const application: Application = {
      userId: this.currentUserId.toString(),
      JobSlug: this.job.slug,
      title: this.job.title,
      company: this.job.company_name,
      location: this.job.location,
      status: 'pending',
      dateAdded: new Date().toISOString(),
      statusUpdated: null
    }

    this.store.dispatch(
      ApplicationsActions.addApplication({ application })
    );
    console.log('Dispatched addApplication action with:', application);
  }





  goToLogin() {
    this.showLoginModal = false;
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }





}
