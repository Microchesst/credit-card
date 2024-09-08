import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCardService } from '../services/credit-card.service';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <h2>Add New Credit Card</h2>
    <form [formGroup]="cardForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="card_number">Card Number:</label>
        <input id="card_number" type="text" formControlName="card_number">
        <div *ngIf="cardForm.get('card_number')?.invalid && (cardForm.get('card_number')?.dirty || cardForm.get('card_number')?.touched)">
          <small *ngIf="cardForm.get('card_number')?.errors?.['required']">Card number is required.</small>
          <small *ngIf="cardForm.get('card_number')?.errors?.['pattern']">Card number must be 7-16 digits.</small>
        </div>
      </div>

      <div>
        <label for="cardholder_name">Cardholder Name:</label>
        <input id="cardholder_name" type="text" formControlName="cardholder_name">
        <div *ngIf="cardForm.get('cardholder_name')?.invalid && (cardForm.get('cardholder_name')?.dirty || cardForm.get('cardholder_name')?.touched)">
          <small *ngIf="cardForm.get('cardholder_name')?.errors?.['required']">Cardholder name is required.</small>
        </div>
      </div>

      <div>
        <label for="csc_code">CSC Code:</label>
        <input id="csc_code" type="text" formControlName="csc_code">
        <div *ngIf="cardForm.get('csc_code')?.invalid && (cardForm.get('csc_code')?.dirty || cardForm.get('csc_code')?.touched)">
          <small *ngIf="cardForm.get('csc_code')?.errors?.['required']">CSC code is required.</small>
          <small *ngIf="cardForm.get('csc_code')?.errors?.['pattern']">CSC code must be 3 digits.</small>
        </div>
      </div>

      <div>
        <label for="expiration_date_month">Expiration Month:</label>
        <input id="expiration_date_month" type="number" formControlName="expiration_date_month">
        <div *ngIf="cardForm.get('expiration_date_month')?.invalid && (cardForm.get('expiration_date_month')?.dirty || cardForm.get('expiration_date_month')?.touched)">
          <small *ngIf="cardForm.get('expiration_date_month')?.errors?.['required']">Expiration month is required.</small>
          <small *ngIf="cardForm.get('expiration_date_month')?.errors?.['min'] || cardForm.get('expiration_date_month')?.errors?.['max']">Expiration month must be between 1 and 12.</small>
        </div>
      </div>

      <div>
        <label for="expiration_date_year">Expiration Year:</label>
        <input id="expiration_date_year" type="number" formControlName="expiration_date_year">
        <div *ngIf="cardForm.get('expiration_date_year')?.invalid && (cardForm.get('expiration_date_year')?.dirty || cardForm.get('expiration_date_year')?.touched)">
          <small *ngIf="cardForm.get('expiration_date_year')?.errors?.['required']">Expiration year is required.</small>
        </div>
      </div>

      <div>
        <label for="issuer">Issuer:</label>
        <input id="issuer" type="text" formControlName="issuer">
      </div>

      <button type="submit" [disabled]="!cardForm.valid">Add Card</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    div {
      display: flex;
      flex-direction: column;
    }
    small {
      color: red;
    }
  `]
})
export class AddCardComponent implements OnInit {
  cardForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private creditCardService: CreditCardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cardForm = this.fb.group({
      card_number: ['', [Validators.required, Validators.pattern(/^\d{7,16}$/)]],
      cardholder_name: ['', Validators.required],
      csc_code: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      expiration_date_month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiration_date_year: ['', Validators.required],
      issuer: ['']
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.creditCardService.addCard(this.cardForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding card:', error);
          // Handle error (e.g., show error message)
        }
      });
    }
  }
}