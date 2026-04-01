import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if they have a token OR if they clicked "Continue as Guest"
  const isGuest = localStorage.getItem('guest_mode') === 'true';

  if (authService.isLoggedIn() || isGuest) {
    return true; // Let them in!
  }
  
  // Otherwise, kick them back to login
  router.navigate(['/login']);
  return false;
};