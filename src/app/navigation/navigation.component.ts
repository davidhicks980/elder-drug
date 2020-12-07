import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';

import {
  dropInAnimation,
  logoSlideAnimation,
  mobileSidenavAnimation,
  slideInLeft,
  slidingContentAnimation,
  slidingSidenavAnimation,
  tableVisibleAnimation,
} from '../animations';
import { LayoutStatus, StateService } from '../state.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [WebsocketService],
  animations: [
    slideInLeft,
    dropInAnimation,
    slidingSidenavAnimation,
    tableVisibleAnimation,
    mobileSidenavAnimation,
    logoSlideAnimation,
    slidingContentAnimation,
    trigger('sidenavExpand', [
      state('closed', style({ transform: 'translateX(0px)' })),
      state('open', style({ transform: 'translateX(0px)' })),

      transition(
        'open => closed',
        group([
          animate(
            '200ms ease',
            keyframes([style({ transform: 'translateX(-285px)', offset: 1 })])
          ),
        ])
      ),

      transition(
        'closed => open',
        animate(
          '400ms ease',
          keyframes([
            style({ transform: 'translateX(-285px)', offset: 0 }),
            style({ transform: 'translateX(0px)', offset: 1 }),
          ])
        )
      ),
      transition(':enter', [
        style({
          transform: 'translateX(-285px)',
        }),
        animate('400ms ease', style({ transform: 'translate(0px)' })),
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0px)',
        }),
        animate(
          '200ms ease',
          style({
            transform: 'translateX(-285px)',
          })
        ),
      ]),
    ]),
  ],
})
export class NavigationComponent {
  @ViewChild('leftdrawer')
  public sidenav!: MatSidenav;
  public tablesLoaded: boolean = false;
  layout: LayoutStatus = this.state.layoutStatus;
  public sidenavOpen: boolean = true;
  constructor(
    public webSocketService: WebsocketService,
    public state: StateService,
    public iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;

      this.sidenavOpen = this.layout.sidenavOpen;
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
