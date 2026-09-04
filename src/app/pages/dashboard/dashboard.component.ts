import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, catchError, finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';
import { ProcurementCentre, ProcurementQueue, ProcurementSlot, ProcurementRecord } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  refreshing = false;
  errorMessage = '';
  todayDate = this.getTodayLocalYMD();

  centreInfo: ProcurementCentre | null = null;
  todayQueue: ProcurementQueue[] = [];
  todaySlots: ProcurementSlot[] = [];
  procurements: ProcurementRecord[] = [];

  // Metrics
  waitingFarmersCount = 0;
  inProcessCount = 0;
  completedProcurementCount = 0;
  totalProcuredQuantity = 0;
  todaySlotsCount = 0;
  totalPaymentsAmount = 0;

  private pollIntervalId: any = null;

  private getTodayLocalYMD(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.loadCentreData();
    this.pollIntervalId = setInterval(() => {
      this.loadCentreData(true);
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
  }

  loadCentreData(isSilent = false): void {
    if (!isSilent) {
      this.loading = true;
    } else {
      this.refreshing = true;
    }
    this.errorMessage = '';
    this.cdr.markForCheck();

    const centreId = this.authService.assignedCentreId() || 1;

    console.log(`CENTRE AUTH → Fetching dashboard data for centreId=${centreId}, date=${this.todayDate}`);

    forkJoin({
      centre: this.centreService.getCentreById(centreId).pipe(catchError(() => of(null))),
      queue: this.centreService.getCentreQueue(centreId, this.todayDate).pipe(catchError(() => of([]))),
      slots: this.centreService.getCentreSlots(centreId, this.todayDate).pipe(catchError(() => of([]))),
      procurements: this.centreService.getCentreProcurements(centreId).pipe(catchError(() => of([]))),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.refreshing = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.centreInfo = res.centre;
          this.todayQueue = res.queue || [];
          this.todaySlots = res.slots || [];
          this.procurements = res.procurements || [];

          this.waitingFarmersCount = this.todayQueue.filter((q) => q.queueStatus === 'WAITING' || q.queueStatus === 'CHECKED_IN' || q.queueStatus === 'SCHEDULED').length;
          this.inProcessCount = this.todayQueue.filter((q) => q.queueStatus === 'IN_PROCESS' || q.queueStatus === 'CALLED').length;
          this.completedProcurementCount = this.todayQueue.filter((q) => q.queueStatus === 'COMPLETED').length;
          this.todaySlotsCount = this.todaySlots.length;
          this.totalProcuredQuantity = this.procurements.reduce((sum, r) => sum + (r.actualQuantityQuintals || r.declaredQuantityQuintals || r.quantityQuintals || 0), 0);
          this.totalPaymentsAmount = this.procurements.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Unable to load live dashboard data. Please try again.';
          this.cdr.markForCheck();
        },
      });
  }

  manualRefresh(): void {
    this.loadCentreData(false);
  }
}
