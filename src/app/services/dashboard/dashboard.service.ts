import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DashboardData } from '../../models/dashboard.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`; 

  getDashboard(): Observable<DashboardData> {
    return this.http.get<ApiResponse<DashboardData>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}