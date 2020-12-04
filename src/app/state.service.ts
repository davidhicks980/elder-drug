import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ToStringPipe } from './to-string.pipe';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

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
  public sidenavOpen: boolean;
  public windowWidthSource = new Subject<LayoutStatus>();
  public windowWidth$ = this.windowWidthSource.asObservable();
  public width: ScreenStatus;

  sidenavStatus$ = this.windowWidthSource.asObservable();

  private tableStatusSource = new Subject<string[]>();
  public activeTables: string[];
  tableStatus$ = this.tableStatusSource.asObservable();
  matcher: any;
  mediaMatcher: any;
  mobileWidth: boolean;
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
      this.sendComponentProperty('howdy');
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
    console.log(`sent ${propertyValue}`);
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

  constructor(public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints['(max-width: 599.99px)']) {
          this.width = ScreenStatus.xSmall;
          this.mobileWidth = true;
        } else if (
          state.breakpoints['(min-width: 600px) and (max-width: 959.99px)']
        ) {
          this.width = ScreenStatus.small;
          this.mobileWidth = false;
        } else {
          this.width = ScreenStatus.large;
          this.mobileWidth = false;
        }
        this.windowWidthSource.next({
          sidenavOpen: this.sidenavOpen,
          screenWidth: this.width,
          mobileWidth: this.mobileWidth,
        });
      });

    this.tableStatus$.subscribe((active) => {
      this.activeTables = active;
    });
  }
}
