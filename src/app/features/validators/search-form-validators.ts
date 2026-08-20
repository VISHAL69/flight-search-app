import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function differentAirportsValidator(fromKey: string, toKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromKey)?.value;
    const to = group.get(toKey)?.value;
    if (!from || !to) {
      return null;
    }
    return from.trim().toLowerCase() === to.trim().toLowerCase() ? { sameAirport: true } : null;
  };
}

export function returnAfterDepartureValidator(
  departureKey: string,
  returnKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const departure: Date | null = group.get(departureKey)?.value;
    const returnDate: Date | null = group.get(returnKey)?.value;
    if (!departure || !returnDate) {
      return null;
    }
    return returnDate.getTime() < departure.getTime() ? { returnBeforeDeparture: true } : null;
  };
}
