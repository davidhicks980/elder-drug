import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';

export default function termExistsInDatabase(
  hasTermFn: (term: string) => boolean,
  delay: number
): AsyncValidatorFn {
  return function (ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return ctrl.valueChanges.pipe(
      debounceTime(delay),
      take(1),
      map(() => {
        return hasTermFn(ctrl.value) ? null : { termabsent: true };
      })
    );
  };
}
