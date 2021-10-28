import { MonoTypeOperatorFunction, Observable, pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type DestroyableComponent = unknown &  {
  destroy$: Observable<unknown> | Subject<unknown>;

}
export function destroy<T>(self: DestroyableComponent ): MonoTypeOperatorFunction<T> {
  return pipe(takeUntil(self.destroy$));
}
