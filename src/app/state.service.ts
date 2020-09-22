import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public sidenavOpen: boolean = false;
  private sidenavSource = new Subject<boolean>();
  public windowWidthSource = new Subject<{}>();
  public windowWidth$ = this.windowWidthSource.asObservable();
  public width: ScreenWidth;

  sidenavStatus$ = this.sidenavSource.asObservable();

  private tableStatusSource = new Subject<string[]>();
  public activeTables: string[];
  tableStatus$ = this.tableStatusSource.asObservable();
  matcher: any;
  mediaMatcher: any;
  mobileWidth: boolean;

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
    this.sidenavSource.next(this.sidenavOpen);
  }
  emitSelectedTables(selections: string[]) {
    this.tableStatusSource.next(selections);
  }

  constructor(public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints['(max-width: 599.99px)']) {
          this.width = ScreenWidth.xSmall;
          this.mobileWidth = true;
        } else if (
          state.breakpoints['(min-width: 600px) and (max-width: 959.99px)']
        ) {
          this.width = ScreenWidth.small;
          this.mobileWidth = false;
        } else {
          this.width = ScreenWidth.large;
          this.mobileWidth = false;
        }
        this.windowWidthSource.next(this.width);
      });

    this.tableStatus$.subscribe((active) => {
      this.activeTables = active;
    });
  }
}

export enum ScreenWidth {
  xSmall = 'XSMALL',
  small = 'SMALL',
  large = 'LARGE',
}
