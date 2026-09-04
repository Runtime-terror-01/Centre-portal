import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  authService = inject(AuthService);

  get centreDisplay(): string {
    const name = this.authService.assignedCentreName();
    const id = this.authService.assignedCentreId();
    if (name && id) return `${name} (#${id})`;
    if (name) return name;
    if (id) return `Centre #${id}`;
    return 'Assigned Procurement Centre';
  }

  logout(): void {
    this.authService.logout();
  }
}
