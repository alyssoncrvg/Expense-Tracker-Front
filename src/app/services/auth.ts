import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  currentUser = signal<LoginResponse | null>(null);

  constructor() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      console.log('Token encontrado no localStorage durante a inicialização do AuthService.');
      this.currentUser.set({ accessToken, refreshToken: '' });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);
        this.currentUser.set(response);
      }),
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro inesperado';
        if (err.error && err.error.message) {
          errorMessage = err.error.message; 
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}