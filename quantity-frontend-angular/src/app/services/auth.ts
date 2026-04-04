import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }

  // loginWithGoogle(): void {
  //   window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  // }
  // ... inside your AuthService class
  loginWithGoogle(): void {
    // Use the dynamic apiUrl from the environment file
    window.location.href = `${environment.apiUrl}/oauth2/authorization/google`;
  }
}