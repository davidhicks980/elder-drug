import { ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class ResizeService {
  resizeObserver: ResizeObserver;
  elementMap = new WeakMap() as WeakMap<
    Element,
    { width: number; mobile: boolean }
  >;
  private _resizedElementSource = new BehaviorSubject(new WeakMap());
  public resizedElement$ = this._resizedElementSource.asObservable();

  private windowWidthSource = new ReplaySubject<LayoutStatus>();
  public windowWidth$ = this.windowWidthSource.asObservable();
  public _isSidenavOpen = true;
  private _isWidthMobile = false;
  public _width: ScreenStatus = ScreenStatus.large;
  private _cachedLayoutType: number;

  destroy() {
    this.resizeObserver.disconnect();
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

  get layoutStatus() {
    return {
      sidenavOpen: this._isSidenavOpen,
      screenWidth: this._width,
      mobileWidth: this._isWidthMobile,
    };
  }

  toggleSidenav() {
    this._isSidenavOpen = !this._isSidenavOpen;
    this.windowWidthSource.next({
      sidenavOpen: this._isSidenavOpen,
      mobileWidth: this._isWidthMobile,
      screenWidth: this._width,
    });
  }

  constructor(_ruler: ViewportRuler) {
    try {
      _ruler.change(12).subscribe((): void => {
        let layoutType = 0;
        if (_ruler.getViewportSize().width < 600) {
          this._isWidthMobile = true;
          this._width = ScreenStatus.xSmall;
          layoutType = 1 * (Number(this._isSidenavOpen) + 1);
        } else if (_ruler.getViewportSize().width < 960) {
          this._width = ScreenStatus.small;
          this._isWidthMobile = false;
          layoutType = 2 * (Number(this._isSidenavOpen) + 1);
        } else {
          this._width = ScreenStatus.large;
          this._isWidthMobile = false;
          layoutType = 3 * (Number(this._isSidenavOpen) + 1);
        }

        if (this._cachedLayoutType !== layoutType) {
          this._cachedLayoutType = layoutType;

          this.windowWidthSource.next({
            sidenavOpen: this._isSidenavOpen,
            screenWidth: this._width,
            mobileWidth: this._isWidthMobile,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.elementMap.get(entry.target).mobile =
          entry.contentRect.width < this.elementMap.get(entry.target).width;
      }
      this._resizedElementSource.next(this.elementMap);
    });
  }
}
