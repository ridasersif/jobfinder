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

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    })

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchJobDetails(slug);
      }
    });

    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;
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



  addFavorite(): void {
    if (!this.job || !this.isLoggedIn || !this.currentUserId) return;

    this.favoriteService.getFavoritesByUserId(this.currentUserId).subscribe({
      next: (response) => {
        const exists = response.some(fav => fav.slug === this.job?.slug);
        if (exists) {
          this.toastService.show('Ce job est déjà dans vos favoris.', 'info');
          return;
        }

        const favorite: Favorite = {
          userId: this.currentUserId!,
          slug: this.job!.slug,
          title: this.job!.title,
          company: this.job!.company_name,
          location: this.job!.location,
        };

        this.favoriteService.addFavorites(favorite).subscribe({
          next: () => {
            this.toastService.show('Job ajouté à vos favoris ! ❤️', 'success');
          },
          error: (err) => {
            console.error('Error adding favorite:', err);
            this.toastService.show('Erreur lors de l\'ajout aux favoris.', 'error');
          }
        })

      },

      error: (err) => {
        console.error('Error fetching favorites:', err);
        this.toastService.show('Erreur lors de la vérification des favoris.', 'error');
      }
    });
  }



  handleFavoriteClick() {

    if (!this.isLoggedIn) {
      this.showLoginModal = true;
      return;
    }
    this.addFavorite();
  }

  goToLogin() {
    this.showLoginModal = false;
    this.router.navigate(['/login'],{
        queryParams: { returnUrl: this.router.url }
      });
  }



  

}
