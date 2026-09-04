import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';
import { Farmer } from '../../core/models/api.models';

@Component({
  selector: 'app-farmers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmers.component.html',
  styleUrls: ['./farmers.component.css'],
})
export class FarmersComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  farmers: Farmer[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadFarmers();
  }

  loadFarmers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService
      .getCentreFarmers(centreId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.farmers = data || [];
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.farmers = [];
          this.errorMessage = err?.error?.message || 'Unable to load registered farmers.';
          this.cdr.markForCheck();
        },
      });
  }
}
