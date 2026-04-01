import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements OnInit {
  isLogin = true; 
  authData = { name: '', email: '', password: '' };

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

  toggleMode() { this.isLogin = !this.isLogin; }

  handleAuth() {
    // This makes the Local Login/Signup button ACTUALLY WORK for the UI.
    // (Later, you will replace this with a real HTTP call to your microservice)
    localStorage.setItem('jwt_token', 'mock_local_token'); 
    localStorage.removeItem('guest_mode');
    this.router.navigate(['/dashboard']);
  }

  loginWithGoogle() { this.authService.loginWithGoogle(); }

  continueAsGuest() {
    localStorage.setItem('guest_mode', 'true');
    localStorage.removeItem('jwt_token'); 
    this.router.navigate(['/dashboard']);
  }
}