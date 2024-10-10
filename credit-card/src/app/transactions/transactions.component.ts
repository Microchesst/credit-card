import { Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  transactions = [
    { credit_card: '1234567890123456', amount: 100, currency: 'USD', comment: 'Office supplies', date: '2024-10-01' },
    { credit_card: '2345678901234567', amount: 50, currency: 'EUR', comment: 'Travel', date: '2024-09-28' },
    { credit_card: '1234567890123456', amount: 200, currency: 'USD', comment: 'Software license', date: '2024-09-20' }
  ];
  
  // To handle filtering by card number
  filterCardNumber = '';
  
  get filteredTransactions() {
    if (!this.filterCardNumber) {
      return this.transactions;
    }
    return this.transactions.filter(transaction =>
      transaction.credit_card.includes(this.filterCardNumber)
    );
  }
  removeTransaction(transaction: any) {
    const index = this.transactions.indexOf(transaction);
    if (index > -1) {
      this.transactions.splice(index, 1);
    }
  }

  addTransaction(transactionForm: any) {
    const newTransaction = transactionForm.value;
    this.transactions.push({
      credit_card: newTransaction.creditCard,
      amount: newTransaction.amount,
      currency: newTransaction.currency,
      comment: newTransaction.comment,
      date: newTransaction.date
    });
    transactionForm.reset();  // Reset the form after submission
  }
  
  
}
