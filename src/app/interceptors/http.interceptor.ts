import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export const appHttpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Clone request and add headers
  const cloned = req.clone({
    setHeaders: { 'Content-Type': 'application/json' }
  });

  const notifications = inject(NotificationService);

  return next(cloned).pipe(
    catchError(err => {
      const msg = err?.error?.message || err?.statusText || 'An error occurred';
      notifications.error(msg);
      return throwError(() => err);
    }),
    finalize(() => {
      // Could stop loading indicator here
    })
  );
};
