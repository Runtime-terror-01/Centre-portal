import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '../core/config/api.config';
import { LoginRequest, LoginResponse, UserProfile } from '../core/models/api.models';

const JWT_KEY = 'agriprocure_jwt';
const USER_KEY = 'agriprocure_user_info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  public currentUser = signal<string | null>(this.getStoredUsername());
  public currentRole = signal<string | null>(this.getStoredRole());
  public assignedCentreId = signal<number>(this.getStoredCentreId());
  public assignedCentreName = signal<string | null>(this.getStoredCentreName());
  public isAuthenticated = signal<boolean>(!!this.getToken());

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AUTH TRACE → login started');
    return this.http.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials).pipe(
      tap((response) => {
        console.log('AUTH TRACE → login HTTP response received');
        const tokenPresent = !!(response && response.token);
        console.log(`AUTH TRACE → token present = ${tokenPresent}`);

        if (tokenPresent) {
          const resolvedCentreId = response.centreId ? Number(response.centreId) : 1;
          sessionStorage.setItem(JWT_KEY, response.token);
          const userInfo = {
            username: response.username,
            role: response.role,
            centreId: resolvedCentreId,
            centreName: response.centreName || 'Karnal Main Mandi Hub',
          };
          sessionStorage.setItem(USER_KEY, JSON.stringify(userInfo));

          this.currentUser.set(response.username);
          this.currentRole.set(response.role);
          this.assignedCentreId.set(resolvedCentreId);
          this.assignedCentreName.set(response.centreName || 'Karnal Main Mandi Hub');
          this.isAuthenticated.set(true);

          console.log(`AUTH TRACE → authenticated = true`);
          console.log(`AUTH TRACE → role = ${response.role}`);
          console.log(`AUTH TRACE → centreId = ${resolvedCentreId}`);
        }
        console.log('AUTH TRACE → login completed');
      })
    );
  }

  public fetchCurrentUser(): Observable<UserProfile | null> {
    if (!this.getToken()) return of(null);
    return this.http.get<UserProfile>(API_ENDPOINTS.ME).pipe(
      tap((profile) => {
        if (profile) {
          const resolvedCentreId = profile.centreId ? Number(profile.centreId) : 1;
          const userInfo = {
            username: profile.username,
            role: profile.role,
            centreId: resolvedCentreId,
            centreName: profile.centreName || 'Karnal Main Mandi Hub',
          };
          sessionStorage.setItem(USER_KEY, JSON.stringify(userInfo));
          this.currentUser.set(profile.username);
          this.currentRole.set(profile.role);
          this.assignedCentreId.set(resolvedCentreId);
          this.assignedCentreName.set(profile.centreName || 'Karnal Main Mandi Hub');
          this.isAuthenticated.set(true);
        }
      }),
      catchError(() => of(null))
    );
  }

  public logout(): void {
    sessionStorage.removeItem(JWT_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.currentRole.set(null);
    this.assignedCentreId.set(1);
    this.assignedCentreName.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(JWT_KEY);
  }

  public isCentreAdmin(): boolean {
    const role = this.currentRole();
    return role === 'ROLE_CENTRE_ADMIN' || role === 'CENTRE_ADMIN';
  }

  public isGovernmentAdmin(): boolean {
    const role = this.currentRole();
    return role === 'ROLE_GOVERNMENT_ADMIN' || role === 'GOVERNMENT_ADMIN';
  }

  private getStoredUsername(): string | null {
    const info = sessionStorage.getItem(USER_KEY);
    if (!info) return null;
    try {
      return JSON.parse(info).username || null;
    } catch {
      return null;
    }
  }

  private getStoredRole(): string | null {
    const info = sessionStorage.getItem(USER_KEY);
    if (!info) return null;
    try {
      return JSON.parse(info).role || null;
    } catch {
      return null;
    }
  }

  private getStoredCentreId(): number {
    const info = sessionStorage.getItem(USER_KEY);
    if (!info) return 1;
    try {
      const parsed = JSON.parse(info);
      return parsed.centreId && Number(parsed.centreId) > 0 ? Number(parsed.centreId) : 1;
    } catch {
      return 1;
    }
  }

  private getStoredCentreName(): string | null {
    const info = sessionStorage.getItem(USER_KEY);
    if (!info) return null;
    try {
      return JSON.parse(info).centreName || null;
    } catch {
      return null;
    }
  }
}
