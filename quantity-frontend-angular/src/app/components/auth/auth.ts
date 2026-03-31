import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.html'
})
export class AuthComponent implements OnInit {
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

  login(): void {
    this.authService.loginWithGoogle();
  }
}