import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ColumnField } from '../enums/ColumnFields';
import { TABLE_ATTRIBUTES } from '../injectables/table-attributes.injectable';
import { TABLE_CONFIG } from '../injectables/table-config.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';
import { TableAttributes } from '../interfaces/TableAttributes';
import { TableConfig } from '../interfaces/TableConfig';
import { BeersField } from './BeersField';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableSelectionSource: BehaviorSubject<TableAttributes> =
    new BehaviorSubject({
      tableNumber: 1,
      fullTitle: '',
      shortName: '',
      identifier: '',
      tableIcon: '',
      description: '',
    });
  selection$ = this.tableSelectionSource.asObservable();
  private descript = new Subject();
  tableDescription$ = this.descript.asObservable();
  private titleSource = new Subject();
  tableTitle$ = this.titleSource.asObservable();
  private tableFilterSource = new Subject();
  tableFilter$ = this.tableFilterSource.asObservable();
  private tableLookup: Map<ColumnField, number>;
  dataSource: BehaviorSubject<BeersField[]> = new BehaviorSubject([]);
  private _page: number;
  public get page(): number {
    return this._page;
  }
  public set page(value: number) {
    if (typeof value === 'number') {
      this._page = value;
      this.emitSelectedTable(this._page);
    } else {
      throw TypeError('Selected page must be a number');
    }
  }

  emitTableFilter(filter: { column: string; term: string }) {
    this.tableFilterSource.next(filter);
  }

  emitSelectedTable(page: number) {
    if (page != this._page) {
      let info = this.tables.filter((table) => table.tableNumber === page);
      if (info.length) {
        this.tableSelectionSource.next(info[0]);
        this._page = page;
      } else {
        throw TypeError('Page does not exist');
      }
    } else {
      throw Error('Page is already selected');
    }
  }
  filterActiveTables(
    searchResults: Partial<BeersEntry[]>,
    columns: ColumnField[]
  ) {
    return columns
      .filter((column) => {
        return (
          this.tableLookup.has(column) &&
          searchResults.some((table) => table[column])
        );
      })
      .map((column) => this.tableLookup.get(column));
  }
  get tables(): TableAttributes[] {
    return this.tableList;
  }

  get tableOptions$(): Observable<TableAttributes[]> {
    return this.searchService.searchResults$.pipe(
      map((results) => {
        let columns = Array.from(Object.keys(results[0])) as ColumnField[];
        //Concat 1 because 1 is the general table and does not have filter fields
        return this.filterActiveTables(results, columns)
          .concat(1)
          .map((page) => {
            return this.tables.filter((table) => table.tableNumber === page)[0];
          });
      })
    );
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
  }
}
