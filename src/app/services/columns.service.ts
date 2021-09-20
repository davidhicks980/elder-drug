import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { TABLE_CONFIG } from '../injectables/table-config.injectable';
import { TableAttributes } from '../interfaces/TableAttributes';
import { TableConfig } from '../interfaces/TableConfig';
import { BeersSearchResult, SearchService } from './search.service';
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private columnSource = new BehaviorSubject<{
    selected: string[];
    columns: string[];
    keys: { selected: string; columns: string };
  }>({ keys: { selected: '', columns: '' }, selected: [], columns: [] });
  keys: {
    selected: string;
    columns: string;
  };
  columnsWithData: Set<string>;
  constructor(
    @Inject(TABLE_CONFIG) private tableConfig: TableConfig[],
    private searchService: SearchService,
    private tableService: TableService
  ) {
    this.tableService.selection$.subscribe((table) => {
      this.emitTableColumns(table);
    });
  }

  private emitTableColumns(table: TableAttributes) {
    let selectedColumns = [],
      columns = [];
    let { columnOptions } = this.tableConfig.find((column) => {
      return column.id === table.tableNumber;
    });
    //Removes any columns that have no entries containing data. Otherwise, empty columns would create visual clutter with no benefit.
    this.columnsWithData = this.createDatafulColumnSet(
      this.searchService.searchResults
    );
    for (let { id, selected } of columnOptions) {
      if (this.columnsWithData.has(id)) {
        if (selected) {
          selectedColumns.push(id);
        }
        columns.push(id);
      }
    }
    this.emitColumns(selectedColumns, columns);
  }

  createDatafulColumnSet(data: BeersSearchResult[]): Set<string> {
    return new Set(data.map((e) => Object.keys(e).filter((k) => e[k])).flat(1));
  }

  get columns$() {
    return this.columnSource.asObservable().pipe(
      distinctUntilChanged(
        (prev, curr) => prev.keys.columns === curr.keys.columns
      ),
      map((source) => source.columns)
    );
  }
  get selected$() {
    return this.columnSource.asObservable().pipe(
      distinctUntilChanged(
        (prev, curr) => prev.keys.selected === curr.keys.selected
      ),
      map((column) => column.selected)
    );
  }

  keyColumns(
    selected: string[],
    columns: string[]
  ): { selected: string; columns: string } {
    return {
      selected: selected.sort().join(','),
      columns: columns.sort().join(','),
    };
  }
  validateColumns(columns: string[]) {
    return (
      !Array.isArray(columns) ||
      !columns.every((column) => typeof column === 'string')
    );
  }
  emitColumns(selected?: string[], columns?: string[]) {
    if (!this.validateColumns(columns)) {
      columns = this.columnSource.value.columns;
    }
    if (!this.validateColumns(selected)) {
      selected = this.columnSource.value.selected;
    }

    this.columnSource.next({
      keys: this.keyColumns(selected, columns),
      selected,
      columns,
    });
  }
}
