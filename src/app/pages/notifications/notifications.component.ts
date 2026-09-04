import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { Notification } from '../../core/models/api.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  private centreService = inject(CentreAdminService);

  notifications: Notification[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.centreService
      .getNotifications()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.notifications = data || [];
          this.errorMessage = '';
        },
        error: (err) => {
          this.notifications = [];
          this.errorMessage = err?.error?.message || 'Unable to load notifications.';
        },
      });
  }
}
