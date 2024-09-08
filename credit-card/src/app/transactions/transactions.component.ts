import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditCardService } from '../services/credit-card.service';

interface Transaction {
  uid: string;
  credit_card: number | string | { card_number: string | number };
  amount: number;
  currency: string;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Transactions</h2>
      <div class="filter-section">
        <label for="cardFilter">Filter by Card Number:</label>
        <input id="cardFilter" [(ngModel)]="cardFilter" (ngModelChange)="filterTransactions()">
      </div>
      <button (click)="showAddTransactionForm = true" class="add-transaction-btn">Add Transaction</button>
      <div *ngIf="showAddTransactionForm" class="add-transaction-form">
        <h3>Add New Transaction</h3>
        <form (ngSubmit)="addTransaction()" class="transaction-form">
          <div class="form-group">
            <label for="credit_card">Credit Card:</label>
            <input id="credit_card" [(ngModel)]="newTransaction.credit_card" name="credit_card" required>
          </div>
          <div class="form-group">
            <label for="amount">Amount:</label>
            <input id="amount" type="number" [(ngModel)]="newTransaction.amount" name="amount" required>
          </div>
          <div class="form-group">
            <label for="currency">Currency:</label>
            <input id="currency" [(ngModel)]="newTransaction.currency" name="currency" required>
          </div>
          <div class="form-group">
            <label for="comment">Comment:</label>
            <input id="comment" [(ngModel)]="newTransaction.comment" name="comment">
          </div>
          <div class="form-group">
            <label for="date">Date:</label>
            <input id="date" type="date" [(ngModel)]="newTransaction.date" name="date" required>
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      </div>
      <ul class="transaction-list">
        <li *ngFor="let transaction of filteredTransactions" class="transaction-item">
          <strong>{{ getCardNumber(transaction.credit_card) }}</strong>
          <span class="amount">{{ transaction.amount }} {{ transaction.currency }}</span>
          <span class="date">{{ transaction.date | date }}</span>
          <p class="comment">{{ transaction.comment }}</p>
          <button (click)="removeTransaction(transaction.uid)" class="remove-btn">Remove</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .filter-section {
      margin-bottom: 20px;
    }
    .add-transaction-btn {
      margin-bottom: 20px;
    }
    .add-transaction-form {
      background-color: white;
      border-radius: var(--border-radius);
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: var(--box-shadow);
    }
    .transaction-form {
      display: grid;
      gap: 15px;
    }
    .transaction-list {
      display: grid;
      gap: 15px;
    }
    .transaction-item {
      background-color: white;
      border-radius: var(--border-radius);
      padding: 15px;
      display: grid;
      gap: 10px;
      box-shadow: var(--box-shadow);
    }
    .transaction-item strong {
      color: var(--primary-color);
      font-size: 1.1em;
    }
    .amount {
      font-weight: bold;
    }
    .date {
      color: #666;
    }
    .comment {
      font-style: italic;
    }
    .remove-btn {
      justify-self: start;
      background-color: var(--secondary-color);
    }
    .remove-btn:hover {
      background-color: #d81b60;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  cardFilter = '';
  showAddTransactionForm = false;
  newTransaction: Partial<Transaction> = {};

  constructor(private creditCardService: CreditCardService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.creditCardService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.filterTransactions();
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        // Handle error (e.g., show error message)
      }
    });
  }

  filterTransactions(): void {
    this.filteredTransactions = this.transactions.filter(t => {
      let cardNumber: string;
      if (typeof t.credit_card === 'number') {
        cardNumber = t.credit_card.toString();
      } else if (typeof t.credit_card === 'string') {
        cardNumber = t.credit_card;
      } else {
        cardNumber = t.credit_card.card_number.toString();
      }
      return cardNumber.includes(this.cardFilter);
    });
  }

  addTransaction(): void {
    if (this.newTransaction.credit_card && this.newTransaction.amount && this.newTransaction.currency && this.newTransaction.date) {
      this.creditCardService.addTransaction(this.newTransaction).subscribe({
        next: () => {
          this.loadTransactions();
          this.showAddTransactionForm = false;
          this.newTransaction = {};
        },
        error: (error) => {
          console.error('Error adding transaction:', error);
          // Handle error (e.g., show error message)
        }
      });
    }
  }

  removeTransaction(uid: string): void {
    this.creditCardService.deleteTransaction(uid).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Error removing transaction:', error);
        // Handle error (e.g., show error message)
      }
    });
  }

  getCardNumber(creditCard: Transaction['credit_card']): string {
    if (typeof creditCard === 'number') {
      return creditCard.toString();
    } else if (typeof creditCard === 'string') {
      return creditCard;
    } else {
      return creditCard.card_number.toString();
    }
  }
}