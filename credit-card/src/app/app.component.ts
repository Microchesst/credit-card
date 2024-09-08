import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header>
      <nav>
        <ul>
          <li><a routerLink="/">Home</a></li>
          <li><a routerLink="/add-card">Add Credit Card</a></li>
          <li><a routerLink="/transactions">Transactions</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    nav ul {
      display: flex;
      list-style-type: none;
      padding: 0;
    }
    nav ul li {
      margin-right: 1rem;
    }
  `]
})
export class AppComponent {
  title = 'credit-card';
}