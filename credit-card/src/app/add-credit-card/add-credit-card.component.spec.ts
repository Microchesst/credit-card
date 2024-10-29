import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AddCreditCardComponent } from './add-credit-card.component';
import { CreditCardService } from '../services/credit-card.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddCreditCardComponent', () => {
  let component: AddCreditCardComponent;
  let fixture: ComponentFixture<AddCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        AddCreditCardComponent
      ],
      providers: [CreditCardService]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.cardForm.valid).toBeFalsy();
  });

  it('should validate card number format', () => {
    const cardNumberControl = component.cardForm.get('card_number');
    cardNumberControl?.setValue('123'); // too short
    expect(cardNumberControl?.valid).toBeFalsy();

    cardNumberControl?.setValue('1234567'); // valid
    expect(cardNumberControl?.valid).toBeTruthy();
  });
});
