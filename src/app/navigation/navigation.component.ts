import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { StateService, ScreenWidth } from '../state.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  tableVisibleAnimation,
  mobileSidenavAnimation,
  logoSlideAnimation,
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
export class NavigationComponent implements AfterViewInit {
  @ViewChild('leftdrawer') public sidenav: MatSidenav;
  sidenavActive: boolean = true;
  public screenSize: ScreenWidth;
  breakpointWidth: ScreenWidth;
  stateLoaded: boolean;
  public tablesLoaded: boolean = false;
  shrinkHeader: boolean;

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

  constructor(
    public webSocketService: WebsocketService,
    public state: StateService,
    iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
    this.state.sidenavStatus$.subscribe((status) => {
      this.sidenavActive = status;
    });

    iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_right.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'chevron_left',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_left.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg')
    );
  }
}
