import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QueueComponent } from './pages/queue/queue.component';
import { CropsComponent } from './pages/crops/crops.component';
import { GatesComponent } from './pages/gates/gates.component';
import { CountersComponent } from './pages/counters/counters.component';
import { SlotsComponent } from './pages/slots/slots.component';
import { ProcurementComponent } from './pages/procurement/procurement.component';
import { FarmersComponent } from './pages/farmers/farmers.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { centreAuthGuard } from './guards/centre-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [centreAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'queue', component: QueueComponent },
      { path: 'crops', component: CropsComponent },
      { path: 'gates', component: GatesComponent },
      { path: 'counters', component: CountersComponent },
      { path: 'slots', component: SlotsComponent },
      { path: 'procurement', component: ProcurementComponent },
      { path: 'farmers', component: FarmersComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  // Catch attempts to enter Government Admin routes
  { path: 'admin', component: AccessDeniedComponent },
  { path: 'government-admin', component: AccessDeniedComponent },
  { path: 'government-admin/:any', component: AccessDeniedComponent },
  { path: 'audit-logs', component: AccessDeniedComponent },
  { path: 'centres', component: AccessDeniedComponent },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
