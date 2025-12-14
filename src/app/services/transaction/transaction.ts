import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction, TransactionRequest } from '../../models/transaction.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  create(transaction: TransactionRequest): Observable<Transaction> {
    return this.http.post<ApiResponse<Transaction>>(this.apiUrl, transaction).pipe(
      map(response => response.data)
    );
  }

  getAll(): Observable<Transaction[]> {
    return this.http.get<ApiResponse<Transaction[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}