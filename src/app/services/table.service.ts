import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import { ColumnField, columns } from '../enums/ColumnFields';
import { TableCategories } from '../enums/TableCategories.enum';
import { TABLE_ATTRIBUTES } from '../injectables/table-attributes.injectable';
import { TABLE_CONFIG } from '../injectables/table-config.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';
import { TableAttributes } from '../interfaces/TableAttributes';
import { TableConfig } from '../interfaces/TableConfig';
import { BeersSearchResult, SearchResult, SearchService } from './search.service';

type StateEntry = string[] | Record<string, string> | string;
type TableConfiguration = TableAttributes & {
  columns: string[];
  selectedColumns: string[];
};

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private selectionSource: BehaviorSubject<TableConfiguration> = new BehaviorSubject({
    tableNumber: -1,
    fullTitle: '',
    shortName: '',
    identifier: '',
    tableIcon: '',
    description: '',
    columns: [],
    selectedColumns: [],
  });
  private columnFilterMap: Map<ColumnField, number>;
  private entrySource: BehaviorSubject<BeersSearchResult[]> = new BehaviorSubject([]);
  readonly entries$ = this.entrySource.asObservable();
  readonly selection$ = this.selectionSource.asObservable();
  state: Record<number, Map<string, StateEntry>> = {};
  tableOptions$: Observable<TableAttributes[]>;
  lastSearch: SearchResult<BeersSearchResult>;
  tableIndices: TableCategories[];
  get table(): number {
    return this.selectionSource.value.tableNumber;
  }
  get tableConfiguration() {
    if (this.table) {
      return this.tableParameters.find((table) => table.id === this.table);
    }
  }

  private getInitialTableState(table: number) {
    return this.tableParameters.find((config) => config.id === table);
  }
  private changeTable(index: number) {
    let { entries, columns } = this.getFilteredSearchResults(index, this.lastSearch.results);
    let configuration = this.getTableConfiguration(index, columns);
    return { configuration, entries };
  }
  emitTableSelection(table: number) {
    if (table && this.tableIndices.includes(table)) {
      let { configuration, entries } = this.changeTable(table);
      this.selectionSource.next(configuration);
      this.entrySource.next(entries);
    } else {
      throw TypeError('Table is not available with your current search');
    }
  }
  /**
   * Filters search results that do not contain data
   *
   * @private
   * @returns {*}
   * @memberof TableService
   */
  private getFilteredSearchResults(index: number, search: BeersSearchResult[]) {
    let results = this.selectEntriesOnTable(index, search);
    let columns = this.filterDatalessColumns(results);
    let entries = this.filterDatalessEntries(results, columns);
    return { columns, entries };
  }

  private filterDatalessEntries(results: BeersSearchResult[], columnsWithData: Set<string>) {
    return results.map((result) =>
      Object.fromEntries(Object.entries(result).filter(([key, value]) => columnsWithData.has(key)))
    ) as Partial<BeersSearchResult[]> & { SearchTerms: string };
  }

  /**
   * @param {number} index The table number
   * @param {BeersSearchResult[]} [results=[]] Search results are optional and are used to emitted only columns that contain data
   * @returns  {TableConfiguration} Table configuration
   * @memberof TableService
   */
  getTableConfiguration(index: number, results: Set<string> = new Set()): TableConfiguration {
    let attributes = this.tableDescriptions.find((table) => table.tableNumber === index);
    let { columnOptions } = this.getInitialTableState(index);
    let selectedColumns = [];
    let columns = [];
    let datafulColumns = results.size ? results : new Set(columnOptions.map((cols) => cols.id));
    for (let { id, selected } of columnOptions) {
      if (datafulColumns.has(id)) {
        columns.push(id);
        if (selected) {
          selectedColumns.push(id);
        }
      }
    }
    return { ...attributes, columns, selectedColumns };
  }
  private getTablesWithEntries(results: Partial<BeersEntry[]>): TableAttributes[] {
    return Array.from(this.columnFilterMap)
      .filter(([field, _]) => results.some((entry) => entry[field]))
      .map(([_, table]) => table)
      .concat(1)
      .filter((table, index, arr) => arr.indexOf(table) === index)
      .map((table) => this.tableDescriptions.find(({ tableNumber }) => tableNumber === table));
  }
  get tableDescriptions(): TableAttributes[] {
    return this.tableList;
  }

  /**
   * Removes empty columns
   *
   * @private
   * @param {BeersSearchResult[]} entries
   * @returns {*}  {Set<string>}
   * @memberof TableService
   */
  private filterDatalessColumns(entries: BeersSearchResult[]): Set<string> {
    return new Set(entries.map((e) => Object.keys(e).filter((k) => !(e[k] == null))).flat(1));
  }

  /**
   * Returns search results that pertain to a particular table. The function filters entries that do not contain a table's defining
   * columns. Defining columns are columns relevant to a purpose of a table -- e.g. for the drug interactions table, the 'Drug
   * Interactions' column would be the defining column
   * @param {BeersSearchResult[]} Results Search results
   * @returns  {BeersSearchResult[]} Entries pertaining to the selected table
   * @memberof TableService
   */
  private selectEntriesOnTable(
    table: number,
    entries: Partial<BeersSearchResult> & { SearchTerms: string }[]
  ): Partial<BeersSearchResult> & { SearchTerms: string }[] {
    let { filters } = this.getInitialTableState(table);
    return entries.filter((entry) => !filters.length || filters.some((filter) => entry[filter]));
  }
  get entries(): BeersSearchResult[] {
    return this.entrySource.getValue().map((e) => ({ ...e }));
  }

  constructor(
    @Inject(TABLE_CONFIG) private tableParameters: TableConfig[],
    @Inject(TABLE_ATTRIBUTES) private tableList: TableAttributes[],
    private searchService: SearchService
  ) {
    let columnTableMap = this.tableParameters
      .map(({ filters, id }) => filters.map((filter) => [filter, id]))
      .flat(1) as [ColumnField, number][];
    this.columnFilterMap = new Map(columnTableMap);
    //Get searches that return entries and that are new
    let result$ = this.searchService.searchResults$.pipe(filter(({ results }) => !!results.length));

    this.tableOptions$ = result$.pipe(
      map(({ results }) => [...this.getTablesWithEntries(results)]),
      map((tables) => tables.sort((a, b) => a.shortName.localeCompare(b.shortName)))
    );

    this.tableOptions$.pipe(withLatestFrom(result$)).subscribe(([tables, results]) => {
      this.tableIndices = tables.map((table) => table.tableNumber);
      this.lastSearch = results;
      this.emitTableSelection(1);
    });
  }
}
