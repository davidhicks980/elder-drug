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
  tableService: TableService;
  @Input() rounded: boolean = false;
  @Output() activeTable = new EventEmitter<number>();
  handleTabClick(table: number, tabIndex: number) {
    this.currentTab = tabIndex;
    this.activeTable.emit(tabIndex);
    this.tableService.emitSelectedTable(table);
  }
  get tableOptions$() {
    return this.tableService.tableOptions$;
  }
  constructor(columns: ColumnService, tables: TableService) {
    this.tableService = tables;
    this.columns = columns;
  }
}
