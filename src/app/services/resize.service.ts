import { Injectable, Renderer2 } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  observer: ResizeObserver;
  elementMap = new WeakMap() as WeakMap<
    Element,
    { width: number; mobile: boolean }
  >;
  changeSubject = new BehaviorSubject(new WeakMap());
  changeStream = this.changeSubject.asObservable();
  destroy() {
    this.observer.disconnect();
  }

  observe(element: Element, width: number): Observable<boolean> {
    this.observer.observe(element);
    this.elementMap.set(element, { width: width, mobile: false });
    const mapToMobile = (() => {
      let elem = element;
      return (
        elements: WeakMap<Element, { width: number; mobile: boolean }>
      ) => {
        return elements?.get(elem)?.mobile;
      };
    })();

    return this.changeStream.pipe(map(mapToMobile));
  }

  constructor() {
    this.observer = new ResizeObserver((entries) => {
      let entry = null as ResizeObserverEntry;
      for (entry of entries) {
        this.elementMap.get(entry.target).mobile =
          entry.contentRect.width < this.elementMap.get(entry.target).width;
      }
      this.changeSubject.next(this.elementMap);
    });
  }
}
