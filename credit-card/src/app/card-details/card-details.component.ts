import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCardService } from '../services/credit-card.service';
import { ExpirationDatePipe } from '../expiration-date.pipe';

interface CreditCard {
  card_number: string;
  cardholder_name: string;
  csc_code: string;
  expiration_date_month: number;
  expiration_date_year: number;
  issuer: string;
}

interface Transaction {
  credit_card: string;
  amount: number;
  currency: string;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, ExpirationDatePipe],
  template: `
    <div *ngIf="card">
      <h1>Credit Card Details</h1>
      <p><strong>Card Number:</strong> {{ card.card_number }}</p>
      <p><strong>Cardholder Name:</strong> {{ card.cardholder_name }}</p>
      <p><strong>CSC Code:</strong> {{ card.csc_code }}</p>
      <p><strong>Expiration Date:</strong> {{ card.expiration_date_month | expirationDate:card.expiration_date_year }}</p>
      <p><strong>Issuer:</strong> {{ card.issuer }}</p>
      <button (click)="removeCard()">Remove Card</button>

      <h2>Transactions</h2>
      <ul>
        <li *ngFor="let transaction of transactions">
          <strong>{{ transaction.amount }} {{ transaction.currency }}</strong>
          <span>{{ transaction.date | date }}</span>
          <p>{{ transaction.comment }}</p>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      border: 1px solid #ddd;
      margin-bottom: 10px;
      padding: 10px;
    }
  `]
})
export class CardDetailsComponent implements OnInit {
  card: CreditCard | null = null;
  transactions: Transaction[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditCardService: CreditCardService
  ) {}

  ngOnInit(): void {
    const cardNumber = this.route.snapshot.paramMap.get('cardNumber');
    if (cardNumber) {
      this.loadCardDetails(cardNumber);
      this.loadTransactions(cardNumber);
    }
  }

  loadCardDetails(cardNumber: string): void {
    this.creditCardService.getCard(cardNumber).subscribe({
      next: (card) => {
        this.card = card;
      },
      error: (error) => {
        console.error('Error fetching card details:', error);
        // Handle error (e.g., show error message, navigate back)
      }
    });
  }

  loadTransactions(cardNumber: string): void {
    this.creditCardService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions.filter(t => t.credit_card === cardNumber);
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        // Handle error
      }
    });
  }

  removeCard(): void {
    if (this.card) {
      this.creditCardService.deleteCard(this.card.card_number).subscribe({
        next: () => {
          // Navigate back to the home page after successful deletion
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error removing card:', error);
          // Handle error (e.g., show error message)
        }
      });
    }
  }
}