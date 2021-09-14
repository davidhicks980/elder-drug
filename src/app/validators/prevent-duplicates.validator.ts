import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function uniqueTerms(
  termArrayGetter: () => string[]
): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    return termArrayGetter()
      .map((term) => term.toLowerCase())
      .includes((value as string).toLowerCase())
      ? { duplicateTerm: value }
      : null;
  };
}
