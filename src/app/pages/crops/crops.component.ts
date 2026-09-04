import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { CentreAdminService, AcceptedCrop } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crops',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crops.component.html',
  styleUrls: ['./crops.component.css'],
})
export class CropsComponent implements OnInit, OnDestroy {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  cropsList: AcceptedCrop[] = [];
  loading = true;
  errorMessage = '';
  private pollIntervalId: any = null;

  ngOnInit(): void {
    this.loadAcceptedCrops();
    this.pollIntervalId = setInterval(() => {
      this.loadAcceptedCrops(true);
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
  }

  loadAcceptedCrops(isSilent = false): void {
    if (!isSilent) this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService
      .getAcceptedCrops(centreId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.cropsList = data || [];
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.cropsList = [];
          this.errorMessage = err?.error?.message || err?.message || 'Unable to load accepted crops data.';
          this.cdr.markForCheck();
        },
      });
  }
}
