import { ViewportRuler } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

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
export class StateService {
  public sidenavOpen: boolean = true;
  public windowWidthSource = new ReplaySubject<LayoutStatus>();
  public windowWidth$ = this.windowWidthSource.asObservable();
  private smallContentSource = new ReplaySubject<boolean>();
  public smallContent$ = this.smallContentSource.asObservable();
  public width: ScreenStatus = ScreenStatus.large;

  sidenavStatus$ = this.windowWidthSource.asObservable();

  public activeTables: string[] = [];
  matcher: any;
  mediaMatcher: any;
  mobileWidth: boolean = false;
  layoutType: number;
  get layoutStatus() {
    return {
      sidenavOpen: this.sidenavOpen,
      screenWidth: this.width,
      mobileWidth: this.mobileWidth,
    };
  }
  emitContentWidthStatus(contentIsSmall: boolean) {
    this.smallContentSource.next(contentIsSmall);
  }
  public requestPropertySource = new Subject<any>();
  public sendPropertySource = new Subject<any>();
  // Observable string streams

  name: string = 'StateService';

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
      _ruler.change(8).subscribe((): void => {
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

        if (this.layoutType !== layoutType) {
          this.layoutType = layoutType;

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
