import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueTerms(termArrayGetter: () => string[]): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    return termArrayGetter()
      .map((term) => term.toLowerCase())
      .includes((value as string).toLowerCase())
      ? { duplicate: value }
      : null;
  };
}
export function uniqueArrayTerm(termArrayGetter: () => string[]): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    return termArrayGetter()
      .map((term) => term.toLowerCase())
      .filter((term) => term === (value as string).toLowerCase())?.length > 1
      ? { duplicate: value }
      : null;
  };
}
