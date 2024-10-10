import { Component } from '@angular/core';

@Component({
  selector: 'app-add-credit-card',
  templateUrl: './add-credit-card.component.html',
  styleUrls: ['./add-credit-card.component.css']
})
export class AddCreditCardComponent {
  onSubmit(cardForm: any) {
    console.log('Form Submitted:', cardForm.value);
    // Here you can add logic to send the form data to your backend server
    
  }
}
