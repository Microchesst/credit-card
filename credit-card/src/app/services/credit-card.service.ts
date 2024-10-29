import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreditCard {
  card_number: number;
  csc_code: number;
  cardholder_name: string;
  expiration_date_month: number;
  expiration_date_year: number;
  issuer: string;
}

export interface Transaction {
  credit_card: CreditCard;
  amount: number;
  comment: string;
  date: number;
  currency: string;
  uid?: string;
}

export const CURRENCIES = [
  'CAD',
  'EUR',
  'KYD',
  'MWK',
  'NAD',
  'USD',
];

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private baseUrl = 'http://localhost:3000'; // Make sure this matches your server URL
  private http = inject(HttpClient);

  getCards(): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(`${this.baseUrl}/cards`);
  }

  getCard(cardNumber: string): Observable<CreditCard> {
    return this.http.get<CreditCard>(`${this.baseUrl}/cards/${cardNumber}`);
  }

  addCard(card: CreditCard): Observable<CreditCard> {
    return this.http.post<CreditCard>(`${this.baseUrl}/cards`, card);
  }

  deleteCard(cardNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cards/${cardNumber}`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction);
  }

  deleteTransaction(transactionUid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/transactions/${transactionUid}`);
  }
}