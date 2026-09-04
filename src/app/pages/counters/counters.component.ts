import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CentreAdminService, CentreCounter, CentreGate } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-counters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.css'],
})
export class CountersComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  countersList: CentreCounter[] = [];
  gatesList: CentreGate[] = [];
  loading = true;
  errorMessage = '';
  statusMessage = '';

  ngOnInit(): void {
    this.loadCountersData();
  }

  loadCountersData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService.getCentreCounters(centreId).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (counters) => {
        this.countersList = counters || [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Unable to load counters data.';
        this.cdr.markForCheck();
      }
    });

    this.centreService.getCentreGates(centreId).subscribe({
      next: (gates) => {
        this.gatesList = gates || [];
        this.cdr.markForCheck();
      }
    });
  }

  assignGate(counterId: number, gateIdStr: string): void {
    const gateId = Number(gateIdStr);
    if (!gateId) return;

    const centreId = this.authService.assignedCentreId() || 1;
    this.centreService.assignGateToCounter(centreId, counterId, gateId).subscribe({
      next: (updatedCounter) => {
        this.showMessage(`Assigned ${updatedCounter.assignedGateName} to ${updatedCounter.counterName}`);
        this.loadCountersData();
      },
      error: (err) => this.showMessage('Failed to assign gate: ' + (err?.error?.message || err.message))
    });
  }

  updateStatus(counterId: number, status: string): void {
    const centreId = this.authService.assignedCentreId() || 1;
    this.centreService.updateCounterStatus(centreId, counterId, status).subscribe({
      next: (updated) => {
        this.showMessage(`${updated.counterName} status updated to ${updated.status}`);
        this.loadCountersData();
      },
      error: (err) => this.showMessage('Failed to update counter status: ' + (err?.error?.message || err.message))
    });
  }

  private showMessage(msg: string): void {
    this.statusMessage = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.statusMessage = '';
      this.cdr.markForCheck();
    }, 4000);
  }
}
