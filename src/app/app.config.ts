import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { LucideAngularModule } from 'lucide-angular';

import { LUCIDE_ICONS } from './shared/icons/lucide-icons';
import { provideStore } from '@ngrx/store';


import { provideEffects } from '@ngrx/effects';
import { favoritesReducer } from './features/favorite/state/favorites.reducer';
import { FavoritesEffects } from './features/favorite/state/favorites.effects';
import { ApplicationsEffects} from './features/application/application/state/applications.effects';
import { applicationReducer } from './features/application/application/state/applications.reducer';

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
    provideStore(
      {favorites: favoritesReducer, applications: applicationReducer}
    ),
     provideEffects([
      FavoritesEffects,
      ApplicationsEffects
    ]),

    importProvidersFrom( LucideAngularModule.pick(LUCIDE_ICONS) )
  ]
};
