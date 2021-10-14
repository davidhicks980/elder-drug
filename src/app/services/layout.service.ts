import { ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ScreenStatus {
  xSmall = 1,
  small = 2,
  large = 3,
}
export enum DirectionsPosition {
  hidden = 0,
  sidebar = 1,
  main = 2,
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
  private openSidenavSource = new BehaviorSubject<boolean>(true);
  private directionsShownSource = new BehaviorSubject<boolean>(true);
  mobile$ = this.mobileSource.asObservable();
  openSidenav$ = this.openSidenavSource.asObservable();
  showDirections$ = this.directionsShownSource.asObservable();
  private toggling: boolean = false;
  private toggleTime: number = 500;
  toggleSidenav(force?: boolean) {
    if (!this.toggling) {
      this.toggling = true;
      this.openSidenavSource.next(force ?? !this.isDrawerOpen);
      setTimeout(() => (this.toggling = false), this.toggleTime);
    }
  }
  setSidenavToggleTime(time: number) {
    this.toggleTime = time;
  }
  get isMobile() {
    return this.mobileSource.value;
  }
  get isDrawerOpen() {
    return this.openSidenavSource.value;
  }
  get areDirectionsShown() {
    return this.directionsShownSource.getValue();
  }

  hideDirections() {
    this.directionsShownSource.next(false);
  }
  showDirections() {
    this.directionsShownSource.next(true);
  }

  constructor() {
    this.mobileQuery.addEventListener('change', (query) => {
      this.mobileSource.next(query.matches);
    });
  }
}
