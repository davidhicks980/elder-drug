import { ViewportRuler } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

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
  public sidenavOpen = true;
  private windowWidthSource = new ReplaySubject<LayoutStatus>();
  public windowWidth$ = this.windowWidthSource.asObservable();

  public width: ScreenStatus = ScreenStatus.large;

  mobileWidth = false;
  private _cachedLayoutType: number;
  get layoutStatus() {
    return {
      sidenavOpen: this.sidenavOpen,
      screenWidth: this.width,
      mobileWidth: this.mobileWidth,
    };
  }

  public requestPropertySource = new Subject<any>();
  public sendPropertySource = new Subject<any>();

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
    this.windowWidthSource.next({
      sidenavOpen: this.sidenavOpen,
      screenWidth: this.width,
      mobileWidth: this.mobileWidth,
    });
  }

  constructor(_ruler: ViewportRuler) {
    try {
      _ruler.change(12).subscribe((): void => {
        let layoutType = 0;
        if (_ruler.getViewportSize().width < 600) {
          this.mobileWidth = true;
          this.width = ScreenStatus.xSmall;
          layoutType = 1 * (Number(this.sidenavOpen) + 1);
        } else if (_ruler.getViewportSize().width < 960) {
          this.width = ScreenStatus.small;
          this.mobileWidth = false;
          layoutType = 2 * (Number(this.sidenavOpen) + 1);
        } else {
          this.width = ScreenStatus.large;
          this.mobileWidth = false;
          layoutType = 3 * (Number(this.sidenavOpen) + 1);
        }

        if (this._cachedLayoutType !== layoutType) {
          this._cachedLayoutType = layoutType;

          this.windowWidthSource.next({
            sidenavOpen: this.sidenavOpen,
            screenWidth: this.width,
            mobileWidth: this.mobileWidth,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
