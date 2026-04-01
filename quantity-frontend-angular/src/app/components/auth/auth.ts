import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Fixes the *ngIf error
import { FormsModule } from '@angular/forms';   // Fixes the ngModel error
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'] // Ensure you have an auth.css file!
})
export class AuthComponent implements OnInit {
  
  // These fix the "Property does not exist" errors!
  isLogin = true; 
  
  authData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.authService.saveToken(params['token']);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  handleAuth() {
    // 1. Give the user a fake VIP wristband
    localStorage.setItem('jwt_token', 'mock_local_token'); 
    localStorage.removeItem('guest_mode');
    
    // 2. SAVE THE USER'S DETAILS TO OUR "FAKE DATABASE" (LocalStorage)
    if (this.isLogin) {
      // If logging in, we only have their email, so let's fake a name from the email
      const nameFromEmail = this.authData.email.split('@')[0];
      localStorage.setItem('user_name', nameFromEmail);
      localStorage.setItem('user_email', this.authData.email);
    } else {
      // If signing up, we have both!
      localStorage.setItem('user_name', this.authData.name);
      localStorage.setItem('user_email', this.authData.email);
    }

    // 3. Route to dashboard
    this.router.navigate(['/dashboard']);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  continueAsGuest() {
    // Flag this browser session as a guest and clear old tokens
    localStorage.setItem('guest_mode', 'true');
    localStorage.removeItem('jwt_token'); 
    this.router.navigate(['/dashboard']);
  }
}