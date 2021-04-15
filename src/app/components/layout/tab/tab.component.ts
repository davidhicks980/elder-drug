import { Component, EventEmitter, Output } from '@angular/core';

import { ColumnService } from '../../../services/columns.service';
import { NavigationService } from '../../../services/navigation.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-tabs',
  template: `
    <div class="tabs" [style.width]="nav.width">
      <ul class="button-row-style">
        <ng-container *ngFor="let tab of shownTabs | async; index as index">
          <li
            [style.zIndex]="index === currentTab ? 1 : 0"
            class="tab-button-li"
            (click)="handleTabClick(tab.TableNumber, index)"
          >
            <a>
              <svg
                [class.active]="index === currentTab"
                [class.inactive]="index != currentTab"
                [class.collapse]="index != 0"
                class="tab-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 37.5"
              >
                <defs>
                  <linearGradient
                    spreadMethod="pad"
                    id="gradient"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop offset="0%" style="stop-color:rgba(0, 0, 0, 0.4)" />
                    <stop offset="5%" style="stop-color:rgba(0, 0, 0, 0.2)" />
                    <stop offset="10%" style="stop-color:rgba(0, 0, 0, 0.1)" />
                    <stop offset="20%" style="stop-color:rgba(0, 0, 0, 0.05)" />
                    <stop
                      offset="40%"
                      style="stop-color:rgba(0, 0, 0, 0.025)"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M193.52,34.47a8.71,8.71,0,0,1-2-5.48V8.5a9.16,9.16,0,0,0-2.19-5.43A9.6,9.6,0,0,0,181.92,0H18.08a9.6,9.6,0,0,0-7.4,3.06A9.16,9.16,0,0,0,8.49,8.5V29a8.71,8.71,0,0,1-2,5.48,8.92,8.92,0,0,1-6.48,3H200A8.92,8.92,0,0,1,193.52,34.47Z"
                  class="tab-svg--path shape"
                />
                <path
                  *ngIf="index != currentTab"
                  d="M193.52,34.47a8.71,8.71,0,0,1-2-5.48V8.5a9.16,9.16,0,0,0-2.19-5.43A9.6,9.6,0,0,0,181.92,0H18.08a9.6,9.6,0,0,0-7.4,3.06A9.16,9.16,0,0,0,8.49,8.5V29a8.71,8.71,0,0,1-2,5.48,8.92,8.92,0,0,1-6.48,3H200A8.92,8.92,0,0,1,193.52,34.47Z"
                  fill="url(#gradient)"
                />
                <text
                  x="50%"
                  y="50%"
                  dominant-baseline="middle"
                  text-anchor="middle"
                  class="tab-svg--text"
                >
                  {{ tab.ShortName }}
                </text>
              </svg>
            </a>
          </li>
        </ng-container>
      </ul>
    </div>
  `,
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  shownTabs: any;
  currentTab: number;
  loaded: boolean;
  itemCount = 1;
  nav: NavigationService;
  columns: ColumnService;
  @Output() tableSelected = new EventEmitter<boolean>();
  tables: TableService;
  handleTabClick(table: number, tabIndex: number) {
    this.currentTab = tabIndex;
    this.columns.requestTable(table);
    this.tableSelected.emit(true);
    this.tables.emitTableInformation(table);
  }
  ngAfterViewInit() {
    this.nav.createIntersectionObserver(document.querySelector('.tabs'));
  }
  constructor(
    nav: NavigationService,
    columns: ColumnService,
    tables: TableService
  ) {
    this.tables = tables;
    this.nav = nav;
    this.shownTabs = this.nav.showTabs ? this.nav.allTabs : this.nav.shownTabs;
    this.columns = columns;
    this.columns.requestTable(3);
  }
}
