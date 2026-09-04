import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/queue', icon: '🔢', label: 'Queue Management' },
    { path: '/crops', icon: '🌾', label: 'Accepted Crops' },
    { path: '/gates', icon: '🚪', label: 'Gate Management' },
    { path: '/counters', icon: '🏬', label: 'Counter Management' },
    { path: '/slots', icon: '📅', label: 'Procurement Slots' },
    { path: '/procurement', icon: '📋', label: 'Procurement Records' },
    { path: '/farmers', icon: '🚜', label: 'Registered Farmers' },
    { path: '/payments', icon: '💳', label: 'Payments' },
    { path: '/reports', icon: '📈', label: 'Centre Reports' },
    { path: '/notifications', icon: '🔔', label: 'Notifications' },
    { path: '/settings', icon: '⚙️', label: 'Centre Settings' },
  ];
}
