import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CentreAdminService } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';
import { ProcurementRecord } from '../../core/models/api.models';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.css'],
})
export class ProcurementComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  procurements: ProcurementRecord[] = [];
  loading = false;
  errorMessage = '';
  statusMessage = '';

  // Process Modal
  selectedRecord: ProcurementRecord | null = null;
  processQualityGrade = 'GRADE_A';
  processMoisture = 12.0;

  ngOnInit(): void {
    this.loadProcurements();
  }

  loadProcurements(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService
      .getCentreProcurements(centreId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.procurements = data || [];
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.procurements = [];
          this.errorMessage = err?.error?.message || 'Unable to load procurement records.';
          this.cdr.markForCheck();
        },
      });
  }

  openProcessModal(record: ProcurementRecord): void {
    this.selectedRecord = record;
    this.processQualityGrade = record.qualityGrade || 'GRADE_A';
    this.processMoisture = record.moisturePercentage || 12.0;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.selectedRecord = null;
    this.cdr.markForCheck();
  }

  submitProcess(): void {
    if (!this.selectedRecord) return;

    const payload = {
      qualityGrade: this.processQualityGrade,
      moisturePercentage: this.processMoisture,
    };

    this.centreService.processProcurement(this.selectedRecord.id, payload).subscribe({
      next: () => {
        this.statusMessage = `Procurement #${this.selectedRecord?.id} processed successfully`;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.statusMessage = '';
          this.cdr.markForCheck();
        }, 3000);
        this.closeModal();
        this.loadProcurements();
      },
      error: (err) => {
        this.statusMessage = 'Failed to process procurement: ' + (err?.error || err.message);
        this.cdr.markForCheck();
      }
    });
  }

  completeProcurement(id: number): void {
    this.centreService.completeProcurement(id).subscribe({
      next: () => {
        this.statusMessage = `Procurement #${id} completed`;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.statusMessage = '';
          this.cdr.markForCheck();
        }, 3000);
        this.loadProcurements();
      },
      error: (err) => {
        this.statusMessage = 'Failed to complete procurement: ' + (err?.error || err.message);
        this.cdr.markForCheck();
      }
    });
  }
}
