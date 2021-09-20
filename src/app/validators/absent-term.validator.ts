import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

export default function termExistsInDatabase(
  hasTermFn: (term: string) => boolean,
  delay: number
): AsyncValidatorFn {
  return function (
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return timer(delay).pipe(
      take(1),
      map(() => (hasTermFn(ctrl.value) ? null : { termabsent: true }))
    );
  };
}
