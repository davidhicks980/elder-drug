import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { SearchService } from './search.service';
import { TableService } from './table.service';

const COLUMN_PLACEHOLDER = {
  keys: { selected: '', columns: '' },
  selected: [],
  columns: [],
};
type KeyedTableColumns = {
  selected: string[];
  columns: string[];
  keys: {
    selected: string;
    columns: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private columnSource = new BehaviorSubject<KeyedTableColumns>(COLUMN_PLACEHOLDER);
  private cache: Map<number, { columns: string[]; selected: string[] }> = new Map();
  columns$ = this.columnSource.asObservable().pipe(
    distinctUntilChanged((prev, curr) => prev.keys.columns === curr.keys.columns),
    map((source) => source.columns)
  );
  selected$ = this.columnSource.asObservable().pipe(
    distinctUntilChanged((prev, curr) => prev.keys.selected === curr.keys.selected),
    map((source) => source.selected)
  );

  get selected() {
    return this.columnSource.value.selected.slice();
  }
  get columns() {
    return this.columnSource.value.columns.slice();
  }
  constructor(private tableService: TableService, private searchService: SearchService) {
    this.searchService.searchResults$.subscribe(() => this.cache.clear());
    this.tableService.selection$.subscribe(({ tableNumber, selectedColumns, columns }) => {
      if (this.cache.has(tableNumber)) {
        let { selected, columns } = this.cache.get(tableNumber);
        this.emitColumns(selected, columns);
      } else {
        this.emitColumns(selectedColumns, columns);
      }
    });
  }

  private keyColumns(selected: string[], columns: string[]): { selected: string; columns: string } {
    return {
      selected: selected.sort().join(','),
      columns: columns.sort().join(','),
    };
  }
  private validateColumns(columns: string[]) {
    return Array.isArray(columns) && columns.every((column) => typeof column === 'string');
  }
  emitColumns(selected?: string[], columns?: string[]) {
    if (!this.validateColumns(columns)) {
      columns = this.columns;
    }
    if (!this.validateColumns(selected)) {
      selected = this.selected;
    }
    this.cache.set(this.tableService.table, { columns, selected });
    this.columnSource.next({
      keys: this.keyColumns(selected, columns),
      selected,
      columns,
    });
  }
}
