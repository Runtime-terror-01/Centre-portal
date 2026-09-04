import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of, catchError, finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  errorMessage = '';
  procurementCount = 0;
  totalQuantity = 0;
  totalAmount = 0;
  farmersCount = 0;
  capacityUtilization = 0;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    forkJoin({
      records: this.centreService.getCentreProcurements(centreId).pipe(catchError(() => of([]))),
      farmers: this.centreService.getCentreFarmers(centreId).pipe(catchError(() => of([]))),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          const records = res.records || [];
          const farmers = res.farmers || [];

          this.procurementCount = records.length;
          this.totalQuantity = records.reduce((acc, curr) => acc + (curr.actualQuantityQuintals || curr.declaredQuantityQuintals || curr.quantityQuintals || 0), 0);
          this.totalAmount = records.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
          this.capacityUtilization = Math.min(100, Math.round((this.totalQuantity / 500) * 100));
          this.farmersCount = farmers.length;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Unable to load report metrics.';
          this.cdr.markForCheck();
        },
      });
  }
}
