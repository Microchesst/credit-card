import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCardService, CreditCard, Transaction } from '../services/credit-card.service';
import { ExpirationDatePipe } from '../expiration-date.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, ExpirationDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container" *ngIf="card">
      <h1>Credit Card Details</h1>
      <div class="card-details">
        <p><strong>Card Number:</strong> {{ card.card_number }}</p>
        <p><strong>Cardholder Name:</strong> {{ card.cardholder_name }}</p>
        <p><strong>CSC Code:</strong> {{ card.csc_code }}</p>
        <p><strong>Expiration Date:</strong> 
           {{ card.expiration_date_month | expirationDate : card.expiration_date_year }}
        </p>
        <p><strong>Issuer:</strong> {{ card.issuer }}</p>
      </div>
      <button (click)="removeCard()" class="remove-btn">Remove Card</button>

      <h2>Transactions</h2>
      <div *ngIf="transactions.length > 0; else noTransactions">
        <ul class="transaction-list">
          <li *ngFor="let transaction of transactions" class="transaction-item">
            <div class="transaction-details">
              <strong>{{ transaction.amount }} {{ transaction.currency }}</strong>
              <span>{{ transaction.date | date }}</span>
              <p *ngIf="transaction.comment">{{ transaction.comment }}</p>
            </div>
          </li>
        </ul>
      </div>
      <ng-template #noTransactions>
        <p class="no-transactions">No transactions found for this card.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .card-details {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .transaction-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 15px;
    }
    .transaction-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .transaction-details {
      display: grid;
      gap: 5px;
    }
    .transaction-details strong {
      color: #2ecc71;
    }
    .no-transactions {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      color: #7f8c8d;
    }
    .remove-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .remove-btn:hover {
      background: #c0392b;
    }
  `]
})
export class CardDetailsComponent implements OnInit {
  card: CreditCard | null = null;
  transactions: Transaction[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private creditCardService = inject(CreditCardService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const cardNumber = this.route.snapshot.paramMap.get('cardNumber');
    if (cardNumber) {
      this.loadCardDetails(cardNumber);
      this.loadTransactions(cardNumber);
    }
  }

  private loadCardDetails(cardNumber: string): void {
    this.creditCardService.getCard(cardNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (card) => {
          this.card = card;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching card details:', error);
          this.router.navigate(['/']);
        }
      });
  }

  private loadTransactions(cardNumber: string): void {
    this.creditCardService.getTransactions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (transactions) => {
          // Compare card numbers instead of entire card object
          this.transactions = transactions.filter(t => 
            String(t.credit_card.card_number) === cardNumber
          );
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
        }
      });
  }

  removeCard(): void {
    if (this.card) {
      this.creditCardService.deleteCard(String(this.card.card_number))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error removing card:', error);
          }
        });
    }
  }
}