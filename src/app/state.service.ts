import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ViewportRuler } from '@angular/cdk/overlay';

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
  public windowWidthSource = new Subject<LayoutStatus>();
  public windowWidth$ = this.windowWidthSource.asObservable();
  public width: ScreenStatus = ScreenStatus.large;

  sidenavStatus$ = this.windowWidthSource.asObservable();

  private tableStatusSource = new Subject<string[]>();
  public activeTables: string[] = [];
  tableStatus$ = this.tableStatusSource.asObservable();
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
  public requestPropertySource = new Subject<any>();
  public sendPropertySource = new Subject<any>();
  // Observable string streams
  receivedRequestedProperties$ = this.requestPropertySource.asObservable();
  sentPropertyResponse$ = this.sendPropertySource.asObservable();
  name: string = 'StateService';

  // Service message commands
  requestComponentProperty(
    sourceComponent: string,
    targetComponent: string,
    targetProperty: string
  ) {
    if (targetComponent === this.name) {
      console.log('sending native property');
      this.sendComponentProperty(targetProperty);
    } else {
      this.requestPropertySource.next({
        source: sourceComponent,
        target: targetComponent,
        property: targetProperty,
      });
    }
  }

  sendComponentProperty(propertyValue: any) {
    this.sendPropertySource.next(propertyValue);
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
    this.windowWidthSource.next({
      sidenavOpen: this.sidenavOpen,
      screenWidth: this.width,
      mobileWidth: this.mobileWidth,
    });
  }
  emitSelectedTables(selections: string[]) {
    this.tableStatusSource.next(selections);
  }

  constructor(_ruler: ViewportRuler) {
    try {
      _ruler.change(16).subscribe((): void => {
        let layoutType = 0;
        if (_ruler.getViewportSize().width < 599.99) {
          this.mobileWidth = true;
          this.width = ScreenStatus.xSmall;
          layoutType = 1 * (Number(this.sidenavOpen) + 1);
        } else if (_ruler.getViewportSize().width < 959.99) {
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

    this.tableStatus$.subscribe((active) => {
      this.activeTables = active;
    });
  }
}
