import { FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function maxArrayLength(max: number): ValidatorFn {
  return (control: FormArray): ValidationErrors | null => {
    if (control.value.length <= max) {
      return null;
    }
    return { termLimit: { value: control.value } };
  };
}
