import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  console.log("SECURITY GUARD BYPASSED: Letting user through to Dashboard!");
  return true; // Always allow access!
};