import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCardService } from '../services/credit-card.service';

@Component({
  selector: 'app-add-credit-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <h2>Add New Credit Card</h2>
      <form [formGroup]="cardForm" (ngSubmit)="onSubmit()" class="card-form">
        <div class="form-group">
          <label for="card_number">Card Number:</label>
          <input id="card_number" type="text" formControlName="card_number">
          <div *ngIf="cardForm.get('card_number')?.invalid && (cardForm.get('card_number')?.dirty || cardForm.get('card_number')?.touched)" class="error-message">
            <small *ngIf="cardForm.get('card_number')?.errors?.['required']">Card number is required.</small>
            <small *ngIf="cardForm.get('card_number')?.errors?.['pattern']">Card number must be 7-16 digits.</small>
          </div>
        </div>

        <div class="form-group">
          <label for="cardholder_name">Cardholder Name:</label>
          <input id="cardholder_name" type="text" formControlName="cardholder_name">
          <div *ngIf="cardForm.get('cardholder_name')?.invalid && (cardForm.get('cardholder_name')?.dirty || cardForm.get('cardholder_name')?.touched)" class="error-message">
            <small *ngIf="cardForm.get('cardholder_name')?.errors?.['required']">Cardholder name is required.</small>
          </div>
        </div>

        <div class="form-group">
          <label for="csc_code">CSC Code:</label>
          <input id="csc_code" type="text" formControlName="csc_code">
          <div *ngIf="cardForm.get('csc_code')?.invalid && (cardForm.get('csc_code')?.dirty || cardForm.get('csc_code')?.touched)" class="error-message">
            <small *ngIf="cardForm.get('csc_code')?.errors?.['required']">CSC code is required.</small>
            <small *ngIf="cardForm.get('csc_code')?.errors?.['pattern']">CSC code must be 3 digits.</small>
          </div>
        </div>

        <div class="form-group">
          <label for="expiration_date_month">Expiration Month:</label>
          <input id="expiration_date_month" type="number" formControlName="expiration_date_month" min="1" max="12">
          <div *ngIf="cardForm.get('expiration_date_month')?.invalid && (cardForm.get('expiration_date_month')?.dirty || cardForm.get('expiration_date_month')?.touched)" class="error-message">
            <small *ngIf="cardForm.get('expiration_date_month')?.errors?.['required']">Expiration month is required.</small>
            <small *ngIf="cardForm.get('expiration_date_month')?.errors?.['min'] || cardForm.get('expiration_date_month')?.errors?.['max']">Month must be between 1 and 12.</small>
          </div>
        </div>

        <div class="form-group">
          <label for="expiration_date_year">Expiration Year:</label>
          <input id="expiration_date_year" type="number" formControlName="expiration_date_year">
          <div *ngIf="cardForm.get('expiration_date_year')?.invalid && (cardForm.get('expiration_date_year')?.dirty || cardForm.get('expiration_date_year')?.touched)" class="error-message">
            <small *ngIf="cardForm.get('expiration_date_year')?.errors?.['required']">Expiration year is required.</small>
          </div>
        </div>

        <div class="form-group">
          <label for="issuer">Issuer:</label>
          <input id="issuer" type="text" formControlName="issuer">
        </div>

        <button type="submit" [disabled]="!cardForm.valid">Add Card</button>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card-form {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error-message {
      color: #dc3545;
      font-size: 0.9em;
      margin-top: 5px;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-top: 20px;
    }
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class AddCreditCardComponent {
  private fb = inject(FormBuilder);
  private creditCardService = inject(CreditCardService);
  private router = inject(Router);

  cardForm = this.fb.group({
    card_number: ['', [Validators.required, Validators.pattern(/^\d{7,16}$/)]],
    cardholder_name: ['', Validators.required],
    csc_code: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    expiration_date_month: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    expiration_date_year: [new Date().getFullYear(), Validators.required],
    issuer: ['']
  });

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.creditCardService.addCard({
        card_number: Number(this.cardForm.get('card_number')?.value) || 0,
        cardholder_name: this.cardForm.get('cardholder_name')?.value || '',
        csc_code: Number(this.cardForm.get('csc_code')?.value) || 0,
        expiration_date_month: Number(this.cardForm.get('expiration_date_month')?.value) || 1,
        expiration_date_year: Number(this.cardForm.get('expiration_date_year')?.value) || new Date().getFullYear(),
        issuer: this.cardForm.get('issuer')?.value || ''
      }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding card:', error);
        }
      });
    }
  }
}