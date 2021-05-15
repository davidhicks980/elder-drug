import { Component, EventEmitter, Output } from '@angular/core';

import { fadeInAnimation } from '../../../animations';
import { ColumnService } from '../../../services/columns.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-tabs',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  animations: [fadeInAnimation],
})
export class TabComponent {
  currentTab: number = 0;
  loaded: boolean = false;
  track: boolean = false;

  columns: ColumnService;
  mouseOver = 0;
  @Output() tableSelected = new EventEmitter<boolean>();
  tables: TableService;
  handleTabClick(table: number, tabIndex: number) {
    this.currentTab = tabIndex;
    this.columns.triggerColumnChange(table);
    // this.tableSelected.emit(true);
    this.tables.emitTableInformation(table);
  }
  ngAfterViewInit() {}
  constructor(columns: ColumnService, tables: TableService) {
    this.tables = tables;
    this.columns = columns;
    this.tables.tableStatus$.subscribe((tableStatuses) => {
      let active = tableStatuses[0].TableNumber;
      this.columns.triggerColumnChange(active);
      this.tables.emitTableInformation(active);
    });
  }
}
