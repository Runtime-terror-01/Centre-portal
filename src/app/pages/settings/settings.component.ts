import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';
import { ProcurementCentre } from '../../core/models/api.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  centre: ProcurementCentre | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCentreDetails();
  }

  loadCentreDetails(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService
      .getCentreById(centreId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.centre = data;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = err?.error?.message || err?.message || 'Failed to load centre details.';
          this.cdr.markForCheck();
        },
      });
  }
}
