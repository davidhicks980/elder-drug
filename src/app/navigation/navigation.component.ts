import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { StateService, ScreenStatus, LayoutStatus } from '../state.service';
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
export class NavigationComponent {
  @ViewChild('leftdrawer') public sidenav: MatSidenav;
  public screenSize: ScreenStatus;
  breakpointWidth: ScreenStatus;
  stateLoaded: boolean;
  public tablesLoaded: boolean = false;
  shrinkHeader: boolean;
  layout: LayoutStatus;

  constructor(
    public webSocketService: WebsocketService,
    public state: StateService,
    iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus) => {
      this.layout = layoutStatus;
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
