import { Component, ViewChild, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StateService } from '../state.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [WebsocketService],
})
export class NavigationComponent implements OnInit {
  //@ViewChildren('searchInputs') submission: ElementRef;
  @ViewChild('leftdrawer') public sidenav: MatSidenav;
  handsetLayout: boolean;
  sidenavActive: boolean;

  ngOnInit() {
    this.sidenavActive = this.stateService.sidenavOpen;
  }

  constructor(
    public webSocketService: WebsocketService,
    breakpointObserver: BreakpointObserver,
    public stateService: StateService
  ) {
    breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        this.handsetLayout = result.matches ? true : false;
      });

    stateService.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
  }
}
