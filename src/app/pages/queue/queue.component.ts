import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout, catchError, throwError } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';
import { ProcurementQueue } from '../../core/models/api.models';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  selectedDate = this.getTodayLocalYMD();
  queueList: ProcurementQueue[] = [];
  loading = false;
  errorMessage = '';
  statusMessage = '';

  constructor() {
    console.log('QUEUE TRACE 1 → QueueComponent constructor');
    console.log('ROUTE TRACE → Queue component created');
  }

  private getTodayLocalYMD(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    console.log('QUEUE TRACE 2 → ngOnInit started');
    this.loadQueue();
  }

  loadQueue(): void {
    this.loading = true;
    console.log('QUEUE TRACE 3 → loading=true');
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    console.log(`QUEUE TRACE 4 → QueueService method called (centreId=${centreId})`);
    console.log('QUEUE TRACE 5 → HTTP request about to be sent');

    this.centreService
      .getCentreQueue(centreId, this.selectedDate)
      .pipe(
        timeout(10000),
        catchError((err) => {
          if (err.name === 'TimeoutError') {
            console.error(`QUEUE TIMEOUT → http://localhost:8080/api/procurement-queue/centre/${centreId}/date/${this.selectedDate}`);
            return throwError(() => new Error('API request timed out (10s)'));
          }
          return throwError(() => err);
        }),
        finalize(() => {
          console.log('QUEUE TRACE FINALIZE → request finalized');
          this.loading = false;
          console.log('QUEUE TRACE 11 → loading=false');
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          console.log('QUEUE TRACE 8 → HTTP response received');
          console.log('QUEUE TRACE 9 → QueueService success');
          console.log('QUEUE TRACE 10 → QueueComponent received data');
          this.queueList = data || [];
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('QUEUE TRACE ERROR → error received', err);
          this.queueList = [];
          this.errorMessage = err?.error?.message || err?.message || 'Unable to load token queue data. Please try again.';
          this.cdr.markForCheck();
        },
      });
  }

  checkIn(queueId: number): void {
    this.centreService.checkInQueueItem(queueId).subscribe({
      next: () => {
        this.showMessage('Token checked in successfully');
        this.loadQueue();
      },
      error: (err) => this.showMessage('Failed to check in: ' + (err?.error || err.message))
    });
  }

  callNext(queueId: number): void {
    this.centreService.callQueueItem(queueId).subscribe({
      next: () => {
        this.showMessage('Farmer token called');
        this.loadQueue();
      },
      error: (err) => this.showMessage('Failed to call farmer: ' + (err?.error || err.message))
    });
  }

  startProcess(queueId: number): void {
    this.centreService.processQueueItem(queueId).subscribe({
      next: () => {
        this.showMessage('Processing started for token');
        this.loadQueue();
      },
      error: (err) => this.showMessage('Failed to start processing: ' + (err?.error || err.message))
    });
  }

  complete(queueId: number): void {
    this.centreService.completeQueueItem(queueId).subscribe({
      next: () => {
        this.showMessage('Procurement completed for token');
        this.loadQueue();
      },
      error: (err) => this.showMessage('Failed to complete: ' + (err?.error || err.message))
    });
  }

  skip(queueId: number): void {
    this.centreService.skipQueueItem(queueId).subscribe({
      next: () => {
        this.showMessage('Token skipped');
        this.loadQueue();
      },
      error: (err) => this.showMessage('Failed to skip: ' + (err?.error || err.message))
    });
  }

  cancel(queueId: number): void {
    this.centreService.cancelQueueItem(queueId).subscribe({
      next: () => {
        this.showMessage('Token cancelled');
        this.loadQueue();
      },
      error: (err) => this.showMessage('Failed to cancel: ' + (err?.error || err.message))
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
