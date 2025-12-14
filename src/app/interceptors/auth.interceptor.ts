import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (token) {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const expirationDate = decoded.exp * 1000;
      const currentDate = Date.now();
      
      const isExpired = currentDate > (expirationDate - 10000);

      if (isExpired) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });
            return next(newReq);
          }),
          catchError((error) => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
    } catch (error) {
      console.error('Token inválido no Storage (formato incorreto). Realizando logout.');
      authService.logout();
      
      // Retorna um erro para cancelar a requisição atual imediatamente
      return throwError(() => new Error('Token inválido ou corrompido'));
    }

    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};