import { Component, ChangeDetectionStrategy, inject, DestroyRef, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditCardService, CreditCard } from '../services/credit-card.service';
import { ExpirationDatePipe } from '../expiration-date.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpirationDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="header">
        <h1>Credit Cards</h1>
        <button [routerLink]="['/add-card']" class="add-button">Add New Credit Card</button>
      </div>
      
      <div *ngIf="creditCards.length > 0; else noCards">
        <ul class="card-list">
          <li *ngFor="let card of creditCards" 
              [routerLink]="['/card-details', card.card_number]" 
              class="card-item">
            <strong>{{ card.card_number }}</strong>
            <span>{{ card.cardholder_name }}</span>
            <span>{{ card.issuer }}</span>
            <span>Expires: {{ card.expiration_date_month | expirationDate : card.expiration_date_year }}</span>
          </li>
        </ul>
      </div>
      
      <ng-template #noCards>
        <div class="no-cards">
          <p>No credit cards found. Click the button above to add a new card.</p>
        </div>
      </ng-template>
    </div>
  `,

  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .add-button {
      background-color: var(--primary-color, #007bff);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .add-button:hover {
      background-color: var(--primary-color-dark, #0056b3);
    }
    .card-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      padding: 0;
      list-style: none;
    }
    .card-item {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.3s;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-item:hover {
      transform: translateY(-5px);
    }
    .card-item strong {
      font-size: 1.2em;
      color: var(--primary-color, #007bff);
    }
    .card-item span {
      margin-top: 5px;
    }
    .no-cards {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      margin-top: 20px;
    }
    @media (max-width: 768px) {
      .card-list {
        grid-template-columns: 1fr;
      }
      .header {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class HomeComponent {
  creditCards: CreditCard[] = [];
  private creditCardService = inject(CreditCardService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  
  constructor() {
    this.loadCreditCards();
  }

  private loadCreditCards(): void {
    this.creditCardService.getCards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cards) => {
          this.creditCards = cards;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching credit cards:', error);
          this.cdr.markForCheck();
        }
      });
  }
}