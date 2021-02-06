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
            <div
              [class.active]="index === currentTab"
              [class.inactive]="index != currentTab"
              [class.collapse]="index != 0"
              class="tab-button"
            >
              <a> {{ tab.ShortName }}</a>
            </div>
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
  handleTabClick(table, tabIndex) {
    this.currentTab = tabIndex;
    this.columns.requestTable(table);
    this.tableSelected.emit(true);
  }
  ngAfterViewInit() {
    this.nav.createIntersectionObserver(document.querySelector('.tabs'));
  }
  constructor(
    nav: NavigationService,
    tables: TableService,
    columns: ColumnService
  ) {
    this.nav = nav;
    this.shownTabs = this.nav.showTabs ? this.nav.allTabs : this.nav.shownTabs;
    this.columns = columns;
    this.columns.requestTable(3);
  }
}
