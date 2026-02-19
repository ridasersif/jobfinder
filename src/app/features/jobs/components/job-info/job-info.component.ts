import { Favorite } from './../../../favorite/models/favorite.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Actions, ofType } from '@ngrx/effects';
import * as FavoritesActions from '../../../favorite/state/favorites.actions';
import * as FavoritesSelectors from '../../../favorite/state/favorites.selectors';
import { Application } from '../../../application/models/application.model';
import * as ApplicationsActions from '../../../application/application/state/applications.actions';
import * as ApplicationsSelectors from '../../../application/application/state/application.selectors';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-info',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './job-info.component.html',
  styleUrl: './job-info.component.scss'
})
export class JobInfoComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  job: Job | null = null;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();
  currentUserId: number | null = null;
  showLoginModal = false;
  isFavorited: boolean = false;
  favorites: Favorite[] = [];
  hasApplied: boolean = false;
  applications: Application[] = [];

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private toastService: ToastService,
    private actions$: Actions
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (!status) {
        this.currentUserId = null;
        this.hasApplied = false;
        this.isFavorited = false;
        this.favorites = [];
        this.applications = [];
      } else {
        const currentUser = this.authService.getCurrentUser();
        this.currentUserId = currentUser?.id ?? null;
        if (this.currentUserId) {
          this.store.dispatch(ApplicationsActions.loadApplications({ userId: this.currentUserId }));
        }
      }
    });

    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;

    // Initial load if already logged in
    if (this.currentUserId) {
      this.store.dispatch(ApplicationsActions.loadApplications({ userId: this.currentUserId }));
    }

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchJobDetails(slug);
      }
    });

    this.store
      .select(FavoritesSelectors.selectAllFavorites)
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favorites = favorites;
        this.updateFavoriteStatus();
      });

    this.store
      .select(ApplicationsSelectors.selectAllApplications)
      .pipe(takeUntil(this.destroy$))
      .subscribe(applications => {
        this.applications = applications;
        this.updateApplicationStatus();
      });

    // Listen for successful application submission
    this.actions$.pipe(
      ofType(ApplicationsActions.addApplicationSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.toastService.show('Candidature envoyée avec succès!', 'success');
    });
  }

  fetchJobDetails(slug: string): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (response) => {
        const foundJob = response.data.find(j => j.slug === slug);

        this.job = foundJob || null;
        this.updateFavoriteStatus();
        this.updateApplicationStatus();
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

  removeFromFavorite(): void {
    if (!this.job || !this.isFavorited) return;

    const favoriteToRemove = this.favorites.find(f => f.slug === this.job?.slug);
    if (favoriteToRemove && favoriteToRemove.id) {
      this.store.dispatch(FavoritesActions.deleteFavorite({ id: favoriteToRemove.id }));
    }
  }

  updateFavoriteStatus(): void {
    if (!this.job) {
      this.isFavorited = false;
      return;
    }
    this.isFavorited = this.favorites.some(fav => fav.slug === this.job?.slug);
  }

  handleFavoriteClick() {
    if (!this.isLoggedIn) {
      this.showLoginModal = true;
      return;
    }

    if (this.isFavorited) {
      this.removeFromFavorite();
    } else {
      this.addToFavorite();
    }
  }

  addToApplication() {
    if (!this.job || !this.isLoggedIn || !this.currentUserId) return;

    // Check if already applied
    if (this.hasApplied) return;

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
  }

  updateApplicationStatus(): void {
    if (!this.job) {
      this.hasApplied = false;
      return;
    }
    this.hasApplied = this.applications.some(app => app.JobSlug === this.job?.slug);
  }





  goToLogin() {
    this.showLoginModal = false;
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
