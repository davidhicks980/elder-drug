import { Component, EventEmitter, Output } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ColumnService } from '../../../services/columns.service';
import { FilterService } from '../../../services/filter.service';
import { GroupByService } from '../../../services/group-by.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
  providers: [GroupByService, ColumnService, FilterService],
})
export class TableCardComponent {
  @Output() columns: EventEmitter<string[]> = new EventEmitter();
  @Output() groups: EventEmitter<string[]> = new EventEmitter();
  activeTable: number;
  formatGroupNames(name: string): string {
    return name?.replace(/([A-Z])/g, ' $1').trim() || '';
  }
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService,
    private filterService: FilterService
  ) {
    combineLatest([
      this.groupService.groupedItems$,
      this.groupService.ungroupedItems$,
      this.columnService.selected$,
      this.columnService.columns$,
    ]).subscribe(([groupedFields, ungroupedFields, selectedColumns, columns]) => {
      console.log(groupedFields, selectedColumns);
      this.tableService.updateTableState(
        {
          groupedFields,
          ungroupedFields,
          selectedColumns,
          columns,
        },
        this.activeTable
      );
    });
    this.tableService.selection$.subscribe((table) => {
      this.activeTable = table.tableNumber;
      this.columnService.changeTable(table);
      let state = this.tableService.activeTableState;
      if (state) {
        let { groupedFields: grouped, ungroupedFields: ungrouped, selectedColumns } = state;
        this.columnService.emitColumns(selectedColumns);
        this.groupService.addItems({ ungrouped, grouped }, true);
        this.columns.emit(selectedColumns);
        this.groups.emit(grouped);
      }
    });
  }
}
