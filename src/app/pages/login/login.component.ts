import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  selectedRole: 'GOVERNMENT_ADMIN' | 'CENTRE_ADMIN' = 'CENTRE_ADMIN';
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  selectRole(role: 'GOVERNMENT_ADMIN' | 'CENTRE_ADMIN'): void {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        
        const isGov = this.authService.isGovernmentAdmin();
        const isCentre = this.authService.isCentreAdmin();
        const roleName = response.role;

        if (this.selectedRole === 'CENTRE_ADMIN') {
          if (!isCentre) {
            this.errorMessage = `Access Denied. Account role (${roleName}) does not have Centre Admin privileges.`;
            this.authService.logout();
            return;
          }
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          // User selected Government Administrator from Centre Admin Portal UI
          if (!isGov) {
            this.errorMessage = `Access Denied. Account role (${roleName}) does not have Government Admin privileges.`;
            this.authService.logout();
            return;
          }
          // Redirect to Government Admin Portal port
          window.location.href = 'http://localhost:4200/dashboard';
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to Spring Boot backend at http://localhost:8080. Please ensure backend is running.';
        } else {
          this.errorMessage = err.error?.message || err.error || 'Authentication failed. Please check credentials.';
        }
      },
    });
  }
}
