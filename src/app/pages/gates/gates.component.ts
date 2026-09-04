import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CentreAdminService, CentreGate, AcceptedCrop } from '../../services/centre-admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gates.component.html',
  styleUrls: ['./gates.component.css'],
})
export class GatesComponent implements OnInit {
  private centreService = inject(CentreAdminService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  gatesList: CentreGate[] = [];
  cropsList: AcceptedCrop[] = [];
  loading = true;
  errorMessage = '';
  statusMessage = '';

  ngOnInit(): void {
    this.loadGatesData();
  }

  loadGatesData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService.getCentreGates(centreId).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (gates) => {
        this.gatesList = gates || [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Unable to load gates data.';
        this.cdr.markForCheck();
      }
    });

    this.centreService.getAcceptedCrops(centreId).subscribe({
      next: (crops) => {
        this.cropsList = crops || [];
        this.cdr.markForCheck();
      }
    });
  }

  assignCrop(gateId: number, cropIdStr: string): void {
    const cropId = Number(cropIdStr);
    if (!cropId) return;

    const centreId = this.authService.assignedCentreId() || 1;
    this.centreService.assignCropToGate(centreId, gateId, cropId).subscribe({
      next: (updatedGate) => {
        this.showMessage(`Successfully assigned ${updatedGate.assignedCropName} to ${updatedGate.gateName}`);
        this.loadGatesData();
      },
      error: (err) => this.showMessage('Failed to assign crop: ' + (err?.error?.message || err.message))
    });
  }

  toggleGateStatus(gateId: number, currentStatus: string): void {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    const centreId = this.authService.assignedCentreId() || 1;

    this.centreService.updateGateStatus(centreId, gateId, newStatus).subscribe({
      next: (updated) => {
        this.showMessage(`${updated.gateName} is now ${updated.status}`);
        this.loadGatesData();
      },
      error: (err) => this.showMessage('Failed to update gate status: ' + (err?.error?.message || err.message))
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
