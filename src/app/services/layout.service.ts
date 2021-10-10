import { ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
export class LayoutService {
  private mobileQuery = window.matchMedia('(max-width:600px)');
  private mobileSource = new BehaviorSubject(this.mobileQuery.matches);
  mobile$ = this.mobileSource.asObservable();
  private openSidenavSource = new BehaviorSubject<boolean>(true);
  openSidenav$ = this.openSidenavSource.asObservable();
  toggleSidenav(force?: boolean) {
    this.openSidenavSource.next(force ?? !this.openSidenavSource.value);
  }
  get isMobile() {
    return this.mobileSource.value;
  }
  get isDrawerOpen() {
    return this.openSidenavSource.value;
  }

  constructor(_ruler: ViewportRuler) {
    this.mobileQuery.addEventListener('change', (query) => {
      this.mobileSource.next(query.matches);
    });
  }
}
