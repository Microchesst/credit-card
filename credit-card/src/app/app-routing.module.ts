import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'add-credit-card', loadChildren: () => import('./add-credit-card/add-credit-card.module').then(m => m.AddCreditCardModule) },
  { path: 'transactions', component: TransactionsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
