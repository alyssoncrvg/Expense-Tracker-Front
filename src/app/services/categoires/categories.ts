import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Category } from '../../models/categorie.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}
