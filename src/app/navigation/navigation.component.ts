import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import {
  dropInAnimation,
  logoSlideAnimation,
  mobileSlidingSidenavAnimation,
  slideInLeft,
  slidingContentAnimation,
  tableVisibleAnimation,
} from '../animations';
import { FirebaseService } from '../firebase.service';
import { LayoutStatus, StateService } from '../state.service';
import { TableService } from '../table.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [FirebaseService],
  animations: [
    slideInLeft,
    dropInAnimation,
    tableVisibleAnimation,
    mobileSlidingSidenavAnimation,
    logoSlideAnimation,
    slidingContentAnimation,
    trigger('arrowSlideLeft', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(200px)',
        }),
        animate(
          '300ms ease',
          style({ opacity: 1, transform: 'translate(0px)' })
        ),
      ]),
    ]),
    trigger('sidenavExpand', [
      state('close', style({ transform: 'translateX(0px)' })),
      state('open', style({ transform: 'translateX(0px)' })),
      state('mobileClose', style({ transform: 'translateX(0px)' })),
      state('mobileOpen', style({ transform: 'translateX(0px)' })),
      transition(
        'mobileOpen => mobileClose',
        group([
          animate(
            '200ms ease',
            keyframes([style({ transform: 'translateX(-500px)', offset: 1 })])
          ),
        ])
      ),
      transition(
        'mobileClose => mobileOpen',
        animate(
          '400ms ease',
          keyframes([
            style({ transform: 'translateX(-500px)', offset: 0 }),
            style({ transform: 'translateX(0px)', offset: 1 }),
          ])
        )
      ),
      transition(
        'open => close',
        group([
          animate(
            '200ms ease',
            keyframes([style({ transform: 'translateX(-285px)', offset: 1 })])
          ),
        ])
      ),

      transition(
        'close => open',
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
  public sidenav!: MatSidenav;
  public tablesLoaded: boolean = false;
  layout: LayoutStatus = this.state.layoutStatus;
  public sidenavOpen: boolean = true;
  public mobileWidth: boolean;
  enabledTables: {
    TableNumber: number;
    TableDefinition: string;
    ShortName: string;
    Identifier: string;
  }[];

  ngAfterViewInit() {}

  constructor(
    public webSocketService: FirebaseService,
    public state: StateService,
    private tableService: TableService
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
      this.mobileWidth = this.layout.mobileWidth;
      this.sidenavOpen = this.layout.sidenavOpen;
    });
    this.tableService.tableStatus$.subscribe((active) => {
      this.enabledTables = active.map(
        (table) =>
          tableService.tables.filter((tab) => tab.TableNumber === table)[0]
      );
    });
  }
}
