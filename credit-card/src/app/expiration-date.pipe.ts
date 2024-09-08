import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expirationDate',
  standalone: true
})
export class ExpirationDatePipe implements PipeTransform {
  transform(month: number, year: number): string {
    // Ensure month is two digits
    const formattedMonth = month.toString().padStart(2, '0');
    // Use last two digits of the year
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}/${formattedYear}`;
  }
}