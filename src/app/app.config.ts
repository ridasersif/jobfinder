import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { LucideAngularModule, Monitor, Palette, TrendingUp, DollarSign, Activity, GraduationCap, Search, MapPin, Clock, Briefcase, CircleDollarSign } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    }),
    importProvidersFrom(LucideAngularModule.pick({ Monitor, Palette, TrendingUp, DollarSign, Activity, GraduationCap, Search, MapPin, Clock, Briefcase, CircleDollarSign }))
  ]
};
