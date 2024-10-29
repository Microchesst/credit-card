import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CreditCardService, Transaction, CreditCard } from '../services/credit-card.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <h2 class="title">Transactions</h2>
      
      <div class="layout-container">
        <!-- Left side: Transactions List -->
        <div class="transactions-section">
          <!-- Filter Section -->
          <div class="filter-section">
            <label for="filterCard" class="filter-label">Filter by Card Number:</label>
            <input 
              id="filterCard" 
              [(ngModel)]="filterCardNumber" 
              (ngModelChange)="onFilterChange()"
              placeholder="Enter card number"
              class="filter-input">
          </div>

          <!-- Transactions List -->
          <div class="transactions-list">
            <div *ngFor="let transaction of filteredTransactions" class="transaction-item">
              <div class="transaction-details">
                <div class="card-info">
                  <strong>Card: {{getDisplayCardNumber(transaction)}}</strong>
                  <span class="cardholder" *ngIf="getCardholderName(transaction)">
                    ({{getCardholderName(transaction)}})
                  </span>
                </div>
                <div class="transaction-info">
                  <div class="amount-currency">
                    <span class="amount">{{transaction.amount}}</span>
                    <span class="currency">{{transaction.currency}}</span>
                  </div>
                  <span class="date">{{transaction.date | date:'mediumDate'}}</span>
                </div>
                <span class="comment" *ngIf="transaction.comment">{{transaction.comment}}</span>
              </div>
              <button (click)="removeTransaction(transaction)" class="remove-btn">Remove</button>
            </div>
          </div>
        </div>

        <!-- Right side: Add Transaction Form -->
        <div class="form-section">
          <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()" class="add-transaction-form">
            <h3>Add New Transaction</h3>
            
            <div class="form-group">
              <label for="credit_card">Credit Card:</label>
              <select id="credit_card" formControlName="credit_card" class="form-control">
                <option value="">Select a card</option>
                <option *ngFor="let card of availableCards" [value]="card.card_number">
                  {{card.card_number}} - {{card.cardholder_name}}
                </option>
              </select>
              <div *ngIf="transactionForm.get('credit_card')?.invalid && transactionForm.get('credit_card')?.touched" 
                   class="error-message">
                Credit card is required
              </div>
            </div>

            <div class="form-group">
              <label for="amount">Amount:</label>
              <input id="amount" type="number" formControlName="amount" class="form-control">
              <div *ngIf="transactionForm.get('amount')?.invalid && transactionForm.get('amount')?.touched" 
                   class="error-message">
                Amount must be greater than 0
              </div>
            </div>

            <div class="form-group">
              <label for="currency">Currency:</label>
              <select id="currency" formControlName="currency" class="form-control">
                <option value="">Select currency</option>
                <option *ngFor="let currency of currencies" [value]="currency">
                  {{currency}}
                </option>
              </select>
              <div *ngIf="transactionForm.get('currency')?.invalid && transactionForm.get('currency')?.touched" 
                   class="error-message">
                Currency is required
              </div>
            </div>

            <div class="form-group">
              <label for="comment">Comment:</label>
              <input id="comment" formControlName="comment" class="form-control">
            </div>

            <div class="form-group">
              <label for="date">Date:</label>
              <input id="date" type="date" formControlName="date" class="form-control">
              <div *ngIf="transactionForm.get('date')?.invalid && transactionForm.get('date')?.touched" 
                   class="error-message">
                Date is required
              </div>
            </div>

            <button type="submit" [disabled]="!transactionForm.valid" class="submit-btn">
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
styles: [`
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .layout-container {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
    align-items: start;
  }

  .transactions-section {
    min-height: 400px;
  }

  .form-section {
    position: sticky;
    top: 20px;
  }

  /* Add responsive layout */
  @media (max-width: 1024px) {
    .layout-container {
      grid-template-columns: 1fr;
    }

    .form-section {
      position: static;
    }
  }
  .title {
    color: #2c3e50;
    margin-bottom: 2rem;
  }

  .filter-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .filter-label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }

  .filter-input {
    width: 95%;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .transaction-item {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .transaction-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .transaction-details {
    flex: 1;
    display: grid;
    gap: 0.75rem;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-info strong {
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .cardholder {
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  .transaction-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .amount-currency {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .amount {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2ecc71;
  }

  .currency {
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  .date {
    color: #95a5a6;
    font-size: 0.9rem;
  }

  .comment {
    color: #7f8c8d;
    font-size: 0.9rem;
    font-style: italic;
  }

    .add-transaction-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.9em;
      margin-top: 5px;
    }

    .remove-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .remove-btn:hover {
      background: #c0392b;
    }

    .submit-btn {
      background: #2ecc71;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 1em;
      transition: background-color 0.3s;
    }

    .submit-btn:hover {
      background: #27ae60;
    }

    .submit-btn:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }

    .no-transactions {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .transaction-item {
        flex-direction: column;
        gap: 10px;
      }

      .remove-btn {
        width: 100%;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private creditCardService = inject(CreditCardService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  transactions: Transaction[] = [];
  availableCards: CreditCard[] = [];
  filterCardNumber = '';
  currencies = ['CAD', 'EUR', 'KYD', 'MWK', 'NAD', 'USD'];

  transactionForm = this.fb.group({
    credit_card: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['', Validators.required],
    comment: [''],
    date: ['', Validators.required]
  });

  // Helper methods for template
  getDisplayCardNumber(transaction: Transaction): string {
    if (!transaction.credit_card) return 'Unknown';
    
    if (typeof transaction.credit_card === 'object' && 'card_number' in transaction.credit_card) {
      return String(transaction.credit_card.card_number);
    }

    if (typeof transaction.credit_card === 'number') {
      return String(transaction.credit_card);
    }

    return 'Unknown';
  }

  getCardholderName(transaction: Transaction): string {
    if (
      transaction.credit_card && 
      typeof transaction.credit_card === 'object' && 
      'cardholder_name' in transaction.credit_card
    ) {
      return transaction.credit_card.cardholder_name;
    }
    return '';
  }

  constructor() {
    this.loadTransactions();
    this.loadCards();
  }

  ngOnInit() {}

  get filteredTransactions() {
    if (!this.filterCardNumber.trim()) {
      return this.transactions;
    }
    const searchTerm = this.filterCardNumber.trim();
    return this.transactions.filter(transaction => {
      const cardNumber = this.getDisplayCardNumber(transaction);
      return cardNumber.includes(searchTerm);
    });
  }

  onFilterChange() {
    this.cdr.markForCheck();
  }

  private loadTransactions() {
    this.creditCardService.getTransactions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
        }
      });
  }

  private loadCards() {
    this.creditCardService.getCards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cards) => {
          this.availableCards = cards;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading cards:', error);
        }
      });
  }

  removeTransaction(transaction: Transaction) {
    if (transaction.uid) {
      this.creditCardService.deleteTransaction(transaction.uid)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loadTransactions(); // Reload all transactions
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error removing transaction:', error);
          }
        });
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const cardNumber = this.transactionForm.get('credit_card')?.value;
      if (!cardNumber) return;

      const selectedCard = this.availableCards.find(card => 
        String(card.card_number) === String(cardNumber)
      );
      
      if (!selectedCard) return;

      const transactionData: Transaction = {
        credit_card: selectedCard,
        amount: Number(this.transactionForm.get('amount')?.value) || 0,
        currency: this.transactionForm.get('currency')?.value || '',
        comment: this.transactionForm.get('comment')?.value || '',
        date: new Date(this.transactionForm.get('date')?.value || '').getTime()
      };

      this.creditCardService.addTransaction(transactionData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loadTransactions(); // Reload all transactions
            this.transactionForm.reset({
              credit_card: '',
              amount: 0,
              currency: '',
              comment: '',
              date: ''
            });
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error adding transaction:', error);
          }
        });
    }
  }
}