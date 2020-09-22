import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { StateService, ScreenWidth } from '../state.service';
import {
  tableVisibleAnimation,
  mobileSidenavAnimation,
  logoSlideAnimation,
} from '../animations';
import {
  slideInLeft,
  dropInAnimation,
  formVisibleAnimation,
} from '../animations';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [WebsocketService],
  animations: [
    slideInLeft,
    dropInAnimation,
    formVisibleAnimation,
    tableVisibleAnimation,
    mobileSidenavAnimation,
    logoSlideAnimation,
  ],
})
export class NavigationComponent implements AfterViewInit, OnInit {
  @ViewChild('leftdrawer') public sidenav: MatSidenav;
  sidenavActive: boolean;
  public screenSize: ScreenWidth;
  breakpointWidth: ScreenWidth;
  stateLoaded: boolean;
  public tablesLoaded: boolean = false;

  ngAfterViewInit() {
    if (this.state.breakpointObserver.isMatched('(max-width: 599.99px)')) {
      this.breakpointWidth = ScreenWidth.xSmall;
    } else if (
      this.state.breakpointObserver.isMatched(
        '(min-width: 600px) and (max-width: 959.99px)'
      )
    ) {
      this.breakpointWidth = ScreenWidth.small;
    } else {
      this.breakpointWidth = ScreenWidth.large;
    }
    this.state.windowWidthSource.next(this.breakpointWidth);
  }
  ngOnInit() {
    this.state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
      this.stateLoaded = true;
    });
  }
  constructor(
    public webSocketService: WebsocketService,
    public state: StateService
  ) {
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
    this.state.sidenavStatus$.subscribe((status) => {
      this.sidenavActive = status;
    });
  }
}
