import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="brand">Credit Card Manager</a>
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
          <li><a routerLink="/add-card" routerLinkActive="active">Add Card</a></li>
          <li><a routerLink="/transactions" routerLinkActive="active">Transactions</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;  /* Darker background for better contrast */
      color: white;
      padding: 1rem 0;
    }
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-links li {
      margin-left: 1rem;
    }
    .nav-links a {
      color: black;  /* Light grey color for better visibility */
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      transition: background-color 0.3s, color 0.3s;
    }
    .nav-links a:hover, .nav-links a.active {
      background-color: #34495e;  /* Slightly lighter than the navbar for contrast */
      color: white;
    }
  `]
})
export class NavbarComponent {}