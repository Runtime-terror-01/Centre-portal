import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../core/config/api.config';
import {
  ProcurementCentre,
  ProcurementQueue,
  ProcurementSlot,
  ProcurementRecord,
  Payment,
  Farmer,
  Notification,
} from '../core/models/api.models';

export interface AcceptedCrop {
  cropId: number;
  cropCode: string;
  cropName: string;
  season: string;
  govtMsp: number;
  mspEffectiveFrom?: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedGateId?: number;
  assignedGateName?: string;
  queueCount: number;
  totalQuantityProcuredQuintals: number;
}

export interface CentreGate {
  id: number;
  centreId: number;
  gateName: string;
  gateNumber: string;
  assignedCropId?: number;
  assignedCropName?: string;
  status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
  queueCount: number;
}

export interface CentreCounter {
  id: number;
  centreId: number;
  counterName: string;
  counterNumber: string;
  assignedGateId?: number;
  assignedGateName?: string;
  status: 'AVAILABLE' | 'PROCESSING' | 'OFFLINE';
  currentTokenId?: number;
  currentTokenNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CentreAdminService {
  private http = inject(HttpClient);

  // Centre Info
  public getCentreById(centreId: number): Observable<ProcurementCentre> {
    return this.http.get<ProcurementCentre>(API_ENDPOINTS.CENTRE_BY_ID(centreId));
  }

  public updateCentreStatus(centreId: number, status: string): Observable<ProcurementCentre> {
    return this.http.put<ProcurementCentre>(`${API_ENDPOINTS.CENTRE_STATUS(centreId)}?status=${status}`, {});
  }

  public updateCentreCapacity(centreId: number, capacity: number): Observable<ProcurementCentre> {
    return this.http.put<ProcurementCentre>(`${API_ENDPOINTS.CENTRE_CAPACITY(centreId)}?capacity=${capacity}`, {});
  }

  // Accepted Crops
  public getAcceptedCrops(centreId: number): Observable<AcceptedCrop[]> {
    return this.http.get<AcceptedCrop[]>(API_ENDPOINTS.ACCEPTED_CROPS(centreId));
  }

  // Gates Management
  public getCentreGates(centreId: number): Observable<CentreGate[]> {
    return this.http.get<CentreGate[]>(API_ENDPOINTS.CENTRE_GATES(centreId));
  }

  public assignCropToGate(centreId: number, gateId: number, cropId: number): Observable<CentreGate> {
    return this.http.put<CentreGate>(API_ENDPOINTS.ASSIGN_CROP_TO_GATE(centreId, gateId, cropId), {});
  }

  public updateGateStatus(centreId: number, gateId: number, status: string): Observable<CentreGate> {
    return this.http.put<CentreGate>(API_ENDPOINTS.UPDATE_GATE_STATUS(centreId, gateId, status), {});
  }

  // Counters Management
  public getCentreCounters(centreId: number): Observable<CentreCounter[]> {
    return this.http.get<CentreCounter[]>(API_ENDPOINTS.CENTRE_COUNTERS(centreId));
  }

  public assignGateToCounter(centreId: number, counterId: number, gateId: number): Observable<CentreCounter> {
    return this.http.put<CentreCounter>(API_ENDPOINTS.ASSIGN_GATE_TO_COUNTER(centreId, counterId, gateId), {});
  }

  public updateCounterStatus(centreId: number, counterId: number, status: string): Observable<CentreCounter> {
    return this.http.put<CentreCounter>(API_ENDPOINTS.UPDATE_COUNTER_STATUS(centreId, counterId, status), {});
  }

  // Queue Operations
  public getCentreQueue(centreId: number, date: string): Observable<ProcurementQueue[]> {
    return this.http.get<ProcurementQueue[]>(API_ENDPOINTS.CENTRE_QUEUE(centreId, date));
  }

  public getWaitingQueue(centreId: number, date: string): Observable<ProcurementQueue[]> {
    return this.http.get<ProcurementQueue[]>(API_ENDPOINTS.WAITING_QUEUE(centreId, date));
  }

  public checkInQueueItem(queueId: number): Observable<ProcurementQueue> {
    return this.http.put<ProcurementQueue>(API_ENDPOINTS.QUEUE_CHECK_IN(queueId), {});
  }

  public callQueueItem(queueId: number): Observable<ProcurementQueue> {
    return this.http.put<ProcurementQueue>(API_ENDPOINTS.QUEUE_CALL(queueId), {});
  }

  public processQueueItem(queueId: number): Observable<ProcurementQueue> {
    return this.http.put<ProcurementQueue>(API_ENDPOINTS.QUEUE_PROCESS(queueId), {});
  }

  public completeQueueItem(queueId: number): Observable<ProcurementQueue> {
    return this.http.put<ProcurementQueue>(API_ENDPOINTS.QUEUE_COMPLETE(queueId), {});
  }

  public skipQueueItem(queueId: number): Observable<ProcurementQueue> {
    return this.http.put<ProcurementQueue>(API_ENDPOINTS.QUEUE_SKIP(queueId), {});
  }

  public cancelQueueItem(queueId: number): Observable<ProcurementQueue> {
    return this.http.put<ProcurementQueue>(API_ENDPOINTS.QUEUE_CANCEL(queueId), {});
  }

  // Slot Management
  public getCentreSlots(centreId: number, date: string): Observable<ProcurementSlot[]> {
    return this.http.get<ProcurementSlot[]>(API_ENDPOINTS.CENTRE_SLOTS(centreId, date));
  }

  public updateSlotStatus(slotId: number, status: string): Observable<ProcurementSlot> {
    return this.http.put<ProcurementSlot>(`${API_ENDPOINTS.SLOT_STATUS(slotId)}?status=${status}`, {});
  }

  // Procurement Records Scoped to Centre
  public getCentreProcurements(centreId: number): Observable<ProcurementRecord[]> {
    return this.http.get<ProcurementRecord[]>(API_ENDPOINTS.PROCUREMENT).pipe(
      map((records) => (records || []).filter((r) => r.centreId === centreId))
    );
  }

  public processProcurement(procurementId: number, payload: any): Observable<ProcurementRecord> {
    return this.http.put<ProcurementRecord>(API_ENDPOINTS.PROCESS_PROCUREMENT(procurementId), payload);
  }

  public completeProcurement(procurementId: number): Observable<ProcurementRecord> {
    return this.http.put<ProcurementRecord>(API_ENDPOINTS.COMPLETE_PROCUREMENT(procurementId), {});
  }

  // Farmers Scoped to Centre
  public getCentreFarmers(centreId: number): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(API_ENDPOINTS.FARMERS).pipe(
      map((farmers) => (farmers || []).filter((f) => !f.centreId || f.centreId === centreId))
    );
  }

  // Payments Scoped to Centre
  public getCentrePayments(centreId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(API_ENDPOINTS.PAYMENTS);
  }

  // Notifications
  public getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS);
  }
}
