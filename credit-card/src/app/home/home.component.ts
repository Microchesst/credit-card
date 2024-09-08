import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditCardService } from '../services/credit-card.service';
import { ExpirationDatePipe } from '../expiration-date.pipe';

interface CreditCard {
  card_number: string;
  cardholder_name: string;
  issuer: string;
  expiration_date_month: number;
  expiration_date_year: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpirationDatePipe],
  template: `
    <div class="container">
      <h1>Credit Cards</h1>
      <ul class="card-list">
        <li *ngFor="let card of creditCards" (click)="navigateToCardDetails(card.card_number)" class="card-item">
          <strong>{{ card.card_number }}</strong>
          <span>{{ card.cardholder_name }}</span>
          <span>{{ card.issuer }}</span>
          <span>Expires: {{ card.expiration_date_month | expirationDate : card.expiration_date_year }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .card-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    .card-item {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.3s;
    }
    .card-item:hover {
      transform: translateY(-5px);
    }
    .card-item strong {
      font-size: 1.2em;
      color: var(--primary-color);
    }
    @media (max-width: 768px) {
      .card-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})

export class HomeComponent implements OnInit {
  creditCards: CreditCard[] = [];

  constructor(private creditCardService: CreditCardService) {}

  ngOnInit(): void {
    this.loadCreditCards();
  }

  loadCreditCards(): void {
    this.creditCardService.getCards().subscribe({
      next: (cards) => {
        this.creditCards = cards;
      },
      error: (error) => {
        console.error('Error fetching credit cards:', error);
        // Here you might want to add some error handling UI
      }
    });
  }

  navigateToCardDetails(cardNumber: string): void {
    // This method is automatically handled by the RouterModule
    // due to the [routerLink] directive in the template
  }
}