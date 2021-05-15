import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class DrugPresenceValidator implements AsyncValidator {
  constructor() {}
  createValidator(drugLookup: DataService, delay: number) {
    return function (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
      return timer(delay).pipe(
        map(() => drugLookup.hasDrug(ctrl.value)),
        map((result: boolean) => (result ? null : { invalidAsync: true })),
        take(1),
        catchError(() => null)
      );
    };
  }
  validate(control) {
    return null;
  }
}
