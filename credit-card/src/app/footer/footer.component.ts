import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2023 Credit Card Manager. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #2c3e50;  /* Match navbar color */
      color: #ecf0f1;  /* Light grey for better readability */
      padding: 1rem 0;
      margin-top: 2rem;
    }
    .container {
      text-align: center;
    }
  `]
})
export class FooterComponent {}