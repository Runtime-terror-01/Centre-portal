import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let requestToSend = req;
  if (token) {
    requestToSend = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  console.log(`HTTP TRACE → OUT\nMETHOD: ${req.method}\nURL: ${req.url}`);
  console.log(`HTTP TRACE → NEXT CALLED`);

  return next(requestToSend).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          console.log(`HTTP TRACE → RESPONSE\nSTATUS: ${event.status}\nURL: ${req.url}`);
        }
      },
      error: (err) => {
        console.error(`HTTP TRACE → ERROR\nSTATUS: ${err.status}\nURL: ${req.url}`);
      },
    }),
    finalize(() => {
      console.log(`HTTP TRACE → FINALIZE\nURL: ${req.url}`);
    })
  );
};
