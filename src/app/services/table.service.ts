import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ColumnField } from '../enums/ColumnFields';
import { TABLE_ATTRIBUTES } from '../injectables/table-attributes.injectable';
import { TABLE_CONFIG } from '../injectables/table-config.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';
import { TableAttributes } from '../interfaces/TableAttributes';
import { TableConfig } from '../interfaces/TableConfig';
import { SearchService } from './search.service';

type TableState = {
  groupedFields: string[];
  ungroupedFields: string[];
  selectedColumns: string[];
  columns: string[];
};

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableSelectionSource: BehaviorSubject<TableAttributes> = new BehaviorSubject({
    tableNumber: 1,
    fullTitle: '',
    shortName: '',
    identifier: '',
    tableIcon: '',
    description: '',
  });

  private tableFilterSource = new Subject();
  private tableLookup: Map<ColumnField, number>;
  private _page: number;
  selection$ = this.tableSelectionSource.asObservable();
  tableFilter$ = this.tableFilterSource.asObservable();
  tableState: Map<number, TableState> = new Map();

  get activeTableState() {
    return this.getTableState(this._page);
  }
  get page(): number {
    return this._page;
  }
  set page(value: number) {
    if (typeof value === 'number') {
      this.emitSelectedTable(this._page);
    } else {
      throw TypeError('Selected page must be a number');
    }
  }

  emitTableFilter(filter: { column: string; term: string }) {
    this.tableFilterSource.next(filter);
  }

  getTableState(page: number): TableState {
    if (!this.tableState.has(page)) {
      const { columns, selectedColumns } = this.createTableState(page);
      this.tableState.set(page, {
        groupedFields: [],
        ungroupedFields: columns,
        columns,
        selectedColumns,
      });
    }
    return this.tableState.get(page);
  }
  private createTableState(page: number): { columns: string[]; selectedColumns: string[] } {
    let table = this.tableConfig.find((table) => table.id === page),
      columns = { columns: [], selectedColumns: [] };
    if (table?.columnOptions) {
      return table?.columnOptions?.reduce((groups, column) => {
        groups.columns.push(column.id);
        if (column.selected) {
          groups.selectedColumns.push(column.id);
        }
        return groups;
      }, columns);
    } else {
      return columns;
    }
  }

  emitSelectedTable(page: number) {
    let info = this.tables.filter((table) => table.tableNumber === page);
    if (info.length) {
      this._page = page;
      this.tableSelectionSource.next(info[0]);
    } else {
      throw TypeError('Page does not exist');
    }
  }
  filterActiveTables(searchResults: Partial<BeersEntry[]>, columns: ColumnField[]) {
    return columns
      .filter((column) => {
        return this.tableLookup.has(column) && searchResults.some((table) => table[column]);
      })
      .map((column) => this.tableLookup.get(column));
  }
  get tables(): TableAttributes[] {
    return this.tableList;
  }

  get tableOptions$(): Observable<TableAttributes[]> {
    return this.searchService.searchResults$.pipe(
      map((results) => {
        if (results.length) {
          let columns = Array.from(Object.keys(results[0])) as ColumnField[];
          //Concat 1 because 1 is the general table and does not have filter fields
          return this.filterActiveTables(results, columns)
            .concat(1)
            .map((page) => {
              return this.tables.filter((table) => table.tableNumber === page)[0];
            });
        } else {
          console.info('No search results');
        }
      })
    );
  }
  deepClone(obj) {
    if (obj === null) return null;
    let clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
      (key) => (clone[key] = typeof obj[key] === 'object' ? this.deepClone(obj[key]) : obj[key])
    );
    if (Array.isArray(obj)) {
      clone.length = obj.length;
      return Array.from(clone);
    }
    return clone;
  }
  updateTableState(state: Partial<TableState>, table: number) {
    let oldState = this.deepClone(this.getTableState(this._page));
    this.tableState.set(table, Object.assign(oldState, state));
  }

  constructor(
    @Inject(TABLE_CONFIG) private tableConfig: TableConfig[],
    @Inject(TABLE_ATTRIBUTES) private tableList: TableAttributes[],
    private searchService: SearchService
  ) {
    let columnTableMap = this.tableConfig
      .map(({ filters, id }) => filters.map((filter) => [filter, id]))
      .flat(1) as [ColumnField, number][];
    this.tableLookup = new Map(columnTableMap);
    this.searchService.searchResults$.subscribe(() => this.emitSelectedTable(1));
  }
}
