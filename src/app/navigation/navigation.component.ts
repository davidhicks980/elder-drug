import { Component, ViewChild } from '@angular/core';

import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [WebsocketService],
})
export class NavigationComponent {
  //@ViewChildren('searchInputs') submission: ElementRef;
  @ViewChild('leftdrawer') public sidenav: MatSidenav;
  handsetLayout: boolean;
  navToggled: boolean = true;
  close() {
    this.sidenav.close();
  }

  constructor(
    public webSocketService: WebsocketService,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        this.handsetLayout = result.matches ? true : false;
      });
  }
}
