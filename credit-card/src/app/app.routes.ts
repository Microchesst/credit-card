import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'add-card', loadComponent: () => import('./add-card/add-card.component').then(m => m.AddCardComponent) },
  { path: 'transactions', loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent) },
  { path: 'card/:cardNumber', loadComponent: () => import('./card-details/card-details.component').then(m => m.CardDetailsComponent) },
];