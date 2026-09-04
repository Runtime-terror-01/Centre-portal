import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';
import { ProcurementSlot } from '../../core/models/api.models';

@Component({
  selector: 'app-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css'],
})
export class SlotsComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  selectedDate = this.getTodayLocalYMD();
  slotList: ProcurementSlot[] = [];
  loading = false;
  errorMessage = '';
  statusMessage = '';

  private getTodayLocalYMD(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService
      .getCentreSlots(centreId, this.selectedDate)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.slotList = data || [];
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.slotList = [];
          this.errorMessage = err?.error?.message || 'Unable to load slots.';
          this.cdr.markForCheck();
        },
      });
  }

  updateStatus(slotId: number, status: string): void {
    this.centreService.updateSlotStatus(slotId, status).subscribe({
      next: () => {
        this.statusMessage = `Slot status updated to ${status}`;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.statusMessage = '';
          this.cdr.markForCheck();
        }, 3000);
        this.loadSlots();
      },
      error: (err) => {
        this.statusMessage = 'Failed to update slot status: ' + (err?.error || err.message);
        this.cdr.markForCheck();
      }
    });
  }
}
