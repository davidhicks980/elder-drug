import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, pluck, tap } from 'rxjs/operators';
import { debounce } from '../functions/debounce';

export type ElementMediaQuery = {
  belowBreakpoint$: Observable<boolean>;
  removeObserver: () => void;
};
@Injectable({
  providedIn: 'root',
})
export class ResizerService {
  private resizedElementSource: BehaviorSubject<{ key: Symbol; belowBreakpoint: boolean }> =
    new BehaviorSubject({ key: Symbol(null), belowBreakpoint: false });
  private resizedElement$ = this.resizedElementSource.asObservable();
  private elementResizeObserver: ResizeObserver;
  private elementMediaQueries: WeakMap<Element, { key: symbol; breakpoint: number }[]> =
    new WeakMap();
  observeBreakpoint(element: HTMLElement, breakpoint: number): ElementMediaQuery {
    let key = Symbol(`resize-instance-${breakpoint}`);
    let entry = { key, breakpoint };
    this.elementMediaQueries.has(element)
      ? this.elementMediaQueries.get(element).push(entry)
      : this.elementMediaQueries.set(element, [entry]);
    let removeObserver = function () {
      this.elementResizeObserver.unobserve(element);
      this.elementMediaQueries.get(element)?.length > 1
        ? this.elementMediaQueries.set(
            element,
            this.elementMediaQueries?.get(element).filter(({ element }) => element.key != key)
          )
        : this.elementMediaQueries?.delete(element);
    }.bind(this);
    let belowBreakpoint$ = this.resizedElement$.pipe(
      filter((result) => result.key === key),
      pluck('belowBreakpoint')
    );
    this.elementResizeObserver.observe(element);
    return { belowBreakpoint$, removeObserver };
  }

  destroy() {
    this.elementResizeObserver.disconnect();
    this.resizedElementSource.complete();
  }
  constructor() {
    let resizeFn = debounce((entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        let queries = this.elementMediaQueries.get(entry.target as Element);
        if (Array.isArray(queries)) {
          for (let { key, breakpoint } of queries) {
            this.resizedElementSource.next({
              key,
              belowBreakpoint: breakpoint > entry.contentRect.width,
            });
          }
        }
      }
    }, 40);
    this.elementResizeObserver = new ResizeObserver(resizeFn);
  }
}
