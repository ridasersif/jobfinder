import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { CanActivateFn,Router } from '@angular/router';



export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedInValue;

  if(!isLoggedIn){
    const returnUrl = state.url;
    router.navigate(['/login'],{ queryParams: { returnUrl: returnUrl } });
    return false;
  }
    return true;

};
