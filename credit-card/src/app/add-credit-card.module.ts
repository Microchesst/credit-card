const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'add-credit-card', loadChildren: () => import('./add-credit-card/add-credit-card.module').then(m => m.AddCreditCardModule) },  // Lazy-loaded module
  { path: 'transactions', component: TransactionsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }  // Default route
];
