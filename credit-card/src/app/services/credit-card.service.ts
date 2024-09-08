import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards`);
  }

  getCard(cardNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cards/${cardNumber}`);
  }

  addCard(card: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cards`, card);
  }

  deleteCard(cardNumber: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cards/${cardNumber}`);
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions`);
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transactions`, transaction);
  }

  deleteTransaction(transactionUid: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/transactions/${transactionUid}`);
  }
}