import { MonoTypeOperatorFunction, Observable, pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function destroy<T>(
  self: Partial<{ destroy$: Observable<unknown> | Subject<unknown> }>
): MonoTypeOperatorFunction<T> {
  return pipe(takeUntil(self.destroy$));
}
