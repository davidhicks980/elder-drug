import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, Injectable } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

export enum ScreenStatus {
  xSmall = 1,
  small = 2,
  large = 3,
}

export type LayoutStatus = {
  sidenavOpen: boolean;
  screenWidth: ScreenStatus;
  mobileWidth: boolean;
};
@Injectable({
  providedIn: 'root',
})
export class ResizeService implements AfterViewInit {
  resizeObserver: ResizeObserver;
  elementMap = new WeakMap() as WeakMap<
    Element,
    { width: number; mobile: boolean }
  >;
  private _resizedElementSource = new BehaviorSubject(new WeakMap());
  public resizedElement$ = this._resizedElementSource.asObservable();
  private _isMobile$!: Observable<boolean>;
  private _sidenavSource = new BehaviorSubject<boolean>(true);
  public _isSidenavOpen = true;
  public _width: ScreenStatus = ScreenStatus.large;
  private _initialWidth: number;
  private _searchStatusSource = new BehaviorSubject(false);
  _isSearching$ = this._searchStatusSource.asObservable();
  destroy() {
    this.resizeObserver.disconnect();
  }
  get mobileObserver() {
    return this._isMobile$;
  }
  get sidenavObserver() {
    return this._sidenavSource.asObservable() as Observable<boolean>;
  }

  get initialWidth() {
    return this._initialWidth;
  }
  observeElement(element: Element, width: number): Observable<boolean> {
    this.resizeObserver.observe(element);
    this.elementMap.set(element, { width: width, mobile: false });
    const mapToMobile = (() => {
      let elem = element;
      return (
        elements: WeakMap<Element, { width: number; mobile: boolean }>
      ) => {
        return elements?.get(elem)?.mobile;
      };
    })();

    return this.resizedElement$.pipe(map(mapToMobile));
  }

  toggleSidenav() {
    this._isSidenavOpen = !this._isSidenavOpen;
    this._sidenavSource.next(this._isSidenavOpen);
  }
  ngAfterViewInit() {
    this._initialWidth = window.innerWidth;
    this._sidenavSource.next(true);
  }
  emitSearchStatus(searchStatus) {
    this._searchStatusSource.next(searchStatus);
  }

  constructor(_ruler: ViewportRuler) {
    const widthPredicate = (val: Event) =>
      (val.target as Window).innerWidth < 600;
    this._isMobile$ = fromEvent(window, 'resize', { passive: true }).pipe(
      auditTime(16),
      map(widthPredicate)
    );

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.elementMap.get(entry.target).mobile =
          entry.contentRect.width < this.elementMap.get(entry.target).width;
      }
      this._resizedElementSource.next(this.elementMap);
    });
  }
}
