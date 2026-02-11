import { SearchService } from './../../../core/services/search.service';
import { ToastService } from './../../../core/services/toast.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, LucideAngularModule]
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  isScrolled = false;
  isJobsPage = false;
  searchQuery = '';
  locationQuery = '';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Track route to show/hide search
    this.checkRoute(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });

    // Initialize search values from service
    this.searchQuery = this.searchService.getSearchQueryValue();
    this.locationQuery = this.searchService.getLocationQueryValue();
  }

  checkRoute(url: string): void {
    this.isJobsPage = url.includes('/jobs');
  }

  onSearchChange(): void {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  onLocationChange(): void {
    this.searchService.setLocationQuery(this.locationQuery);
  }

  logout(): void {
    this.authService.logout();
    this.toastService.show('Déconnexion réussie');
    this.router.navigate(['/home']);
  }

}
