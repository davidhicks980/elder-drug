import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { fadeInAnimation } from '../../../animations';
import { ColumnService } from '../../../services/columns.service';
import { TableService } from '../../../services/table.service';
import { tabAnimations } from './tab.animations';

@Component({
  selector: 'elder-tabs',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  animations: [fadeInAnimation, tabAnimations.round('roundTab')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  currentTab: number = 0;
  loaded: boolean = false;
  track: boolean = false;
  columns: ColumnService;
  mouseOver = 0;
  tables: TableService;
  @Input() rounded: boolean = false;
  @Output() tableSelected = new EventEmitter<boolean>();
  handleTabClick(table: number, tabIndex: number) {
    this.currentTab = tabIndex;
    this.columns.triggerColumnChange(table);
    // this.tableSelected.emit(true);
    this.tables.emitTableInformation(table);
  }
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
