import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { StateService, ScreenWidth } from '../state.service';
import { slideInLeft, dropInAnimation } from '../animations';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [WebsocketService],
  animations: [slideInLeft, dropInAnimation],
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('leftdrawer') public sidenav: MatSidenav;
  sidenavActive: boolean;
  public screenSize: ScreenWidth;
  breakpointWidth: ScreenWidth;

  ngAfterViewInit() {
    this.sidenavActive = this.state.sidenavOpen;
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

  constructor(
    public webSocketService: WebsocketService,
    public state: StateService
  ) {
    state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
  }
}
