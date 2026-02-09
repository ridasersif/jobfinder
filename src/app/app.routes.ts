import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)},
      {path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)},

    ]
  },
  {
    path: '', loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)},
      {path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)},
    ]
  },
   {path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)}
];
