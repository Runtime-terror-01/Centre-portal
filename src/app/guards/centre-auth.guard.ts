import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const centreAuthGuard: CanActivateFn = (route, state) => {
  console.log(`ROUTE TRACE → Centre Admin route requested: ${state.url}`);
  console.log('ROUTE TRACE → AuthGuard entered');

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    console.log('ROUTE TRACE → AuthGuard result = false (Not Authenticated)');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Verify user is Centre Admin
  if (!authService.isCentreAdmin()) {
    if (authService.isGovernmentAdmin()) {
      console.log('ROUTE TRACE → AuthGuard result = false (Gov Admin user)');
      router.navigate(['/access-denied']);
      return false;
    }
    console.log('ROUTE TRACE → AuthGuard result = false (Non-Centre Admin user)');
    authService.logout();
    return false;
  }

  console.log('ROUTE TRACE → AuthGuard result = true (Access Granted)');
  return true;
};
