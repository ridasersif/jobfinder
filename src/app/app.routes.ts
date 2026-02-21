import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
      { path: 'favorites', loadComponent: () => import('./features/favorite/favorite/favorite.component').then(m => m.FavoriteComponent), canActivate: [authGuard] },
      {
        path: 'jobs',
        loadComponent: () => import('./features/jobs/components/job-list/job-list.component').then(m => m.JobListComponent),
        children: [
          { path: ':slug', loadComponent: () => import('./features/jobs/components/job-info/job-info.component').then(m => m.JobInfoComponent) }
        ]
      },
      { path: 'applications', loadComponent: () => import('./features/application/application/application.component').then(m => m.ApplicationComponent), canActivate: [authGuard] },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: '', loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
