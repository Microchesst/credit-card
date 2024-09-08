import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditCardService } from '../services/credit-card.service';

interface CreditCard {
  card_number: string;
  cardholder_name: string;
  issuer: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h1>Credit Cards</h1>
    <ul class="card-list">
      <li *ngFor="let card of creditCards" (click)="navigateToCardDetails(card.card_number)">
        <strong>{{ card.card_number }}</strong>
        <span>{{ card.cardholder_name }}</span>
        <span>{{ card.issuer }}</span>
      </li>
    </ul>
  `,
  styles: [`
    .card-list {
      list-style-type: none;
      padding: 0;
    }
    .card-list li {
      border: 1px solid #ddd;
      margin-bottom: 10px;
      padding: 10px;
      cursor: pointer;
    }
    .card-list li:hover {
      background-color: #f0f0f0;
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