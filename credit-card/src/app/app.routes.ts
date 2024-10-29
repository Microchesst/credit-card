import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'add-card', // Changed from 'add-credit-card'
    loadComponent: () => import('./add-credit-card/add-credit-card.component')
      .then(m => m.AddCreditCardComponent)
  },
  {
    path: 'card-details/:cardNumber', // Make sure parameter name matches
    loadComponent: () => import('./card-details/card-details.component')
      .then(m => m.CardDetailsComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./transactions/transactions.component')
      .then(m => m.TransactionsComponent)
  },
  {
    path: '**', // Catch all route
    redirectTo: 'home'
  }
];