import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
  BehaviorSubject,
  combineLatest,
  from,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { groupBy, map, switchMap, tap } from 'rxjs/operators';

import { slideDownAnimation } from '../../animations';
import { ColumnService } from '../../services/columns.service';
import { DataService, Table } from '../../services/data.service';
import { ColumnSelectorComponent } from './dropdown/column-selector/column-selector.component';

@Component({
  selector: 'elder-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    slideDownAnimation,

    trigger('translateRationale', [
      state('expanded', style({ transform: 'translateY(0)' })),
      state('closed', style({ transform: 'translateY(-200px)' })),
      transition(
        'closed<=>expanded',
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),

      transition(
        'expanded<=>closed',
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),

    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),

    /** Animation that moves the sort indicator. */
    trigger('indicator', [
      state('active-asc, asc', style({ transform: 'translateY(-6px)' })),
      // 10px is the height of the sort indicator, minus the width of the pointers
      state('active-desc, desc', style({ transform: 'translateY(4px)' })),
      transition(
        'active-asc <=> active-desc',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  cols: {}[];
  pageChangeObserver: any;
  page: any;
  viewLoaded: boolean;
  dataSource: BeersTableDataSource<Table, Paginator>;
  groupProperty = 'SearchTerms';
  groupingCriteria: { term: string; shown: string[] };
  animations = true;
  private _fields: string[] = ['Items'];
  selectedRow: any;
  groups: Map<string, GroupI> = new Map();

  trackByFn(e: any, g: any) {
    return `${e}-${g}`;
  }
  filterData(term) {
    this.dataSource.filter = term.target.value;
  }
  expandRow(row: any) {
    if (!this.selectedRow) {
      this.selectedRow = row;
    } else {
      this.selectedRow = false;
    }
  }
  get columnSpan() {
    return this._fields.length;
  }

  toggleGroup(group: string) {
    this.groups.has(group)
      ? this.groups.delete(group)
      : this.groups.set(group, {
          level: this.groups.size,
          expanded: false,
          name: group,
        });
  }
  addGroup(group: string) {
    this.dataSource.groupTerms = [];
  }

  expandGroup(term: string) {
    if (this.groups.has(term)) {
      this.groups.get(term).expanded = !this.groups.get(term).expanded;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.changeDetect.markForCheck();
  }

  get selectComponent() {
    return this.selector;
  }
  constructor(
    private columnService: ColumnService,
    private dataService: DataService,
    private changeDetect: ChangeDetectorRef,
    private selector: ColumnSelectorComponent
  ) {
    this.selector = selector;
    this.dataService = dataService;
    this.columnService = columnService;
    this.dataSource = new BeersTableDataSource(
      this.dataService.tableSource,
      this.columnService.observeActiveColumns$
    );
  }

  isGroup(item: { isGroup: boolean }): boolean {
    return item.isGroup;
  }

  isShown(item: { isGroup: any }): boolean {
    return !item.isGroup;
  }
  trackingFunct(item: { tableID: any }) {
    return item.tableID;
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
const MAX_SAFE_INTEGER = 9007199254740991;

interface Paginator {
  page: Subject<PageEvent>;
  pageIndex: number;
  initialized: Observable<void>;
  pageSize: number;
  length: number;
}
interface Entries {
  (value: string | number, rows: Entries[] | []): boolean;
}
interface GroupI {
  level: number;
  name: string;
  expanded: boolean;
}

/** Shared base class with MDC-based implementation. */
export class BeersTableDataSource<T, P extends Paginator> extends DataSource<
  T
> {
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<string>('');

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  private _renderChangesSubscription: Subscription | null = null;

  /**
   * The filtered set of data that has been matched by the filter string, or all the data if there
   * is no filter. Useful for knowing the set of data the table represents.
   * For example, a 'selectAll()' function would likely want to select the set of filtered data
   * shown to the user rather than all the data.
   */
  private _group = new BehaviorSubject(new Map()) as BehaviorSubject<
    Map<string, GroupI>
  >;
  private _groupTerm: BehaviorSubject<GroupI[]>;
  private _dataLoaded = false;

  filteredData: T[];

  groupingParameters: any;
  _dataHeaders: boolean;

  private _rows = new Set() as Set<number>;
  groupTerm: any;
  private _displayedColumns: Observable<string[]> = of(['']);
  private _toggledRows: BehaviorSubject<Set<string>> = new BehaviorSubject(
    new Set()
  );

  /** Ingests a stream of any columns that are marked to be shown and that contain data
   * @property {headers} headers - A stream of headers from your table source.
   */
  observeColumnChanges(headers: Observable<string[]>) {
    this._displayedColumns = combineLatest([this._data, headers]).pipe(
      map((headers) => this._filterEmptyColumns(headers))
    );
  }
  /**
   *
   * A list of table columns to display
   * @readonly
   * @memberof BeersTableDataSource
   */
  get displayedColumns() {
    return this._displayedColumns;
  }
  get displayedGroups() {
    return [...this._group.value.values()];
  }
  /* private _filterGroupedColumns = (groupedColumns: Map<string, GroupI>) => (
    headers: string[]
  ) => {
    if (groupedColumns.size === 0) {
      return headers;
    } else {
      let arrGroupedColumns = [...groupedColumns.keys()];
      return headers.filter((header) => !arrGroupedColumns.includes(header));
    }
  };*/

  get dataLoaded() {
    return this._dataLoaded;
  }
  get groupTerms(): GroupI[] {
    if (this._groupTerm.value) {
      return this._groupTerm.value;
    }
  }
  set groupTerms(terms: GroupI[]) {
    if (terms && Array.isArray(terms) && terms.length > 0) {
      this._groupTerm.next(terms);
    }
  }

  get expandedRows(): Set<number> {
    return this._rows;
  }

  /** Array of objects that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }
  set data(data: T[]) {
    this._data.next(data);
  }
  toggleRow(index: number) {
    this._rows.has(index) ? this._rows.delete(index) : this._rows.add(index);
  }

  toggleRowExpansion(index: number, rowData: any) {
    this._rows;
  }
  toggleGroup(group: string) {
    const newGroup = this._group.value || new Map();
    newGroup.has(group)
      ? newGroup.delete(group)
      : newGroup.set(group, { order: 0, expanded: false, groupName: group });
    this._group.next(newGroup);
  }
  toggleExpansion(row) {
    let { root, EntryID: entry, index } = row;
    const key = root + entry + index;
    const toggledRows = this._toggledRows.value as Set<string>;
    toggledRows.has(key) ? toggledRows.delete(key) : toggledRows.add(key);
    this._toggledRows.next(toggledRows);
  }
  rowIsExpanded(rowData) {
    return this._toggledRows?.value?.has(
      rowData.root + rowData.EntryID + rowData.index
    );
  }
  checkIsGroup(index: number, rowData) {
    return rowData.isGroup;
  }

  /**
   * Filter term that should be used to filter out objects from the data array. To override how
   * data objects match to this filter string, provide a custom function for filterPredicate.
   */
  get filter(): string {
    return this._filter.value;
  }
  set filter(filter: string) {
    this._filter.next(filter);
  }

  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger an update to the table's rendered data.
   */
  get sort(): MatSort | null {
    return this._sort;
  }
  set sort(sort: MatSort | null) {
    this._sort = sort;
    this._updateChangeSubscription();
  }
  private _sort: MatSort | null;

  /**
   * Instance of the MatPaginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the MatPaginator will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the paginator's properties to calculate which page of data
   * should be displayed. If the paginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
   * initialized before assigning it to this data source.
   
  get paginator(): P | null {
    return this._paginator;
  }
  set paginator(paginator: P | null) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }
  private _paginator: P | null;
*/
  /**
   * Data accessor function that is used for accessing data properties for sorting through
   * the default sortData function.
   * This default function assumes that the sort header IDs (which defaults to the column name)
   * matches the data's properties (e.g. column Xyz represents data['Xyz']).
   * May be set to a custom function for different behavior.
   *
   * @param data Data object that is being accessed.
   * @param sortHeaderId The name of the column that represents the data.
   */
  private _sortingDataAccessor: (
    data: T,
    sortHeaderId: string
  ) => string | number = (data: T, sortHeaderId: string): string | number => {
    const value = (data as { [key: string]: any })[sortHeaderId];
    if (_isNumberValue(value)) {
      const numberValue = Number(value);

      // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
      // leave them as strings. For more info: https://goo.gl/y5vbSg
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }

    return value;
  };

  /**
   * Gets a sorted copy of the data array based on the state of the MatSort. Called
   * after changes are made to the filtered data or when sort changes are emitted from MatSort.
   * By default, the function retrieves the active sort and its direction and compares data
   * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
   * of data ordering.
   *
   * @param data The array of data that should be sorted.
   * @param sort The connected MatSort that holds the current sort state.
   */
  sortData: (data: T[], sort: MatSort) => T[] = (
    data: T[],
    sort: MatSort
  ): T[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == '') {
      return data;
    }
    return data.sort((a, b) => {
      let valueA = this._sortingDataAccessor(a, active);
      let valueB = this._sortingDataAccessor(b, active);
      // If there are data in the column that can be converted to a number,
      // it must be ensured that the rest of the data
      // is of the same type so as not to order incorrectly.
      const valueAType = typeof valueA;
      const valueBType = typeof valueB;

      if (valueAType !== valueBType) {
        if (valueAType === 'number') {
          valueA += '';
        }
        if (valueBType === 'number') {
          valueB += '';
        }
      }

      // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
      // one value exists while the other doesn't. In this case, existing value should come last.
      // This avoids inconsistent results when comparing values to undefined/null.
      // If neither value exists, return 0 (equal).
      let comparatorResult = 0;
      if (valueA != null && valueB != null) {
        // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
        if (valueA > valueB) {
          comparatorResult = 1;
        } else if (valueA < valueB) {
          comparatorResult = -1;
        }
      } else if (valueA != null) {
        comparatorResult = 1;
      } else if (valueB != null) {
        comparatorResult = -1;
      }

      return comparatorResult * (direction == 'asc' ? 1 : -1);
    });
  };

  /**
   * Checks if a data object matches the data source's filter string. By default, each data object
   * is converted to a string of its properties and returns true if the filter has
   * at least one occurrence in that string. By default, the filter string has its whitespace
   * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
   * filter matching.
   * @param data Data object used to check against the filter.
   * @param filter Filter string that has been set on the data source.
   * @returns Whether the filter matches against the data
   */
  filterPredicate: (data: T, filter: string) => boolean = (
    data: T,
    filter: string
  ): boolean => {
    // Transform the data into a lowercase string of all property values.
    const dataStr = Object.keys(data)
      .reduce((currentTerm: string, key: string) => {
        // Use an obscure Unicode character to delimit the words in the concatenated string.
        // This avoids matches where the values of two columns combined will match the user's query
        // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
        // that has a very low chance of being typed in by somebody in a text field. This one in
        // particular is "White up-pointing triangle with dot" from
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '')
      .toLowerCase();
    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) != -1;
  };

  convertObservableToBehaviorSubject<T>(
    observable: Observable<T>
  ): BehaviorSubject<T> {
    let observed: T;
    observable.toPromise().then((item) => {
      observed = item;
    });
    const subject = new BehaviorSubject(observed);

    observable.subscribe(
      (x: T) => {
        subject.next(x);
      },
      (err: any) => {
        subject.error(err);
      },
      () => {
        subject.complete();
      }
    );

    return subject;
  }
  constructor(dataStream: Observable<T[]>, columnStream: Observable<string[]>) {
    super();
    this._data = this.convertObservableToBehaviorSubject(dataStream);
    this.observeColumnChanges(columnStream);
    this._updateChangeSubscription();
  }
  private _appendRow(item: any, layer: number, root: string) {
    let isExpanded = this._toggledRows?.value?.has(root + layer) || false;
    return {
      root: root ? root : 'root',
      ...item,
      index: layer,
      isGroup: false,
      expanded: isExpanded,
    };
  }

  private _appendSubHeader(item: any, layer: number, root: string) {
    let isExpanded =
      this._toggledRows?.value?.has(root + item.entryID + layer) || false;

    return {
      root: root ? root : 'root',
      value: item.value,
      index: layer,
      isGroup: true,
      expanded: isExpanded,
    };
  }

  private _flattenNestedNodes(nodes: any[], stack = [], layer = 0) {
    layer++;
    let rootVal, hasChild, item;
    for (item of nodes) {
      hasChild = item?.rows?.length > 0;
      rootVal = layer === 1 && hasChild ? item.value : rootVal;
      if (item && Array.isArray(item.rows) && hasChild) {
        stack.push(this._appendSubHeader(item, layer, rootVal));
        this._flattenNestedNodes(item.rows, stack, layer);
      } else {
        stack.push(this._appendRow(item, layer, rootVal));
      }
    }
    return stack;
  }
  private _groupBy(arr: any[], fields: string[]): any[] {
    let field = fields[0] as string; // take first field
    if (!field) return arr; //if field does not exist, return the array
    let recursedArray = Object.values(
      arr.reduce((obj, current: Entries) => {
        //If current object does not exist, set the value to the current field, and provide empty rows at the bottom of the tree
        if (!obj[current[field]])
          obj[current[field]] = { value: current[field], rows: [] };
        //else push the current object into {values: field, rows: [...currobj] }
        obj[current[field]].rows.push(current);
        return obj;
      }, {})
    );

    // iterate through each child's rows if there are remaining fields
    if (fields.length) {
      recursedArray.forEach((obj: any) => {
        obj.count = obj.rows.length;
        obj.rows = this._groupBy(obj.rows, fields.slice(1)); //remove the current field from the list of fields
      });
    }
    return recursedArray;
  }
  private _groupData(data: T[]) {
    if (this._group.value.size > 0) {
      const groups = [...this._group.value.keys()];
      data = this._groupBy(data, groups);
    }
    return this._flattenNestedNodes(data);
  }

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter, sort, and pagination along with
   * the provided base data and send it to the table for rendering.
   */
  private _updateChangeSubscription() {
    // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
    // The events should emit whenever the component emits a change or initializes, or if no
    // component is provided, a stream with just a null event should be provided.
    // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
    // pipeline can progress to the next step. Note that the value from these streams are not used,
    // they purely act as a signal to progress in the pipeline.
    const sortChange: Observable<Sort | null | void> = this._sort
      ? (merge(
          this._sort.sortChange,
          this._sort.initialized
        ) as Observable<Sort | void>)
      : of(null);
    const dataStream = this._data;
    dataStream.pipe(tap(console.log)).subscribe();
    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([dataStream, this._filter]).pipe(
      map(([data]) => this._filterData(data))
    );
    // Watch for base data or filter changes to provide a filtered set of data.

    // Watch for filtered data or sort changes to provide an ordered set of data.
    const sortedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this._orderData(data))
    );

    const groupedData = combineLatest([sortedData, this._group]).pipe(
      map(([data]) => this._groupData(data))
    );
    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = groupedData.subscribe((data) => {
      this._renderData.next(data as any);
      this._dataLoaded = true;
    });
  }

  /**
   *
   *
   * @param {*} [tableArray, headers]
   * @returns {*}  {string[]}
   */
  private _filterEmptyColumns = ([tableArray, headers]: [
    T[],
    string[]
  ]): string[] => {
    let exists = {};
    return tableArray
      .map((table) =>
        headers.filter((header) =>
          table[header] && !exists.hasOwnProperty(header)
            ? (exists[header] = true)
            : false
        )
      )
      .flat();
  };

  /**
   * Returns a filtered data array where each filter object contains the filter string within
   * the result of the filterTermAccessor function. If no filter is set, returns the data array
   * as provided.
   */
  private _filterData(data: T[]) {
    // If there is a filter string, filter out data that does not contain it.
    // Each data object is converted to a string using the function defined by filterTermAccessor.
    // May be overridden for customization.
    this.filteredData =
      this.filter == null || this.filter === ''
        ? data
        : data.filter((obj) => this.filterPredicate(obj, this.filter));
    return this.filteredData;
  }

  /**
   * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
   * data array as provided. Uses the default data accessor for data lookup, unless a
   * sortDataAccessor function is defined.
   */
  private _orderData(data: T[]): T[] {
    // If there is no active sort or direction, return the data without trying to sort.
    if (!this.sort) {
      return data;
    }
    return this.sortData(data.slice(), this.sort);
  }

  /**
   * Used by the MatTable. Called when it connects to the data source.
   *
   * @docs-private
   */
  connect() {
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }
    this._renderData.subscribe(console.log);
    return this._renderData;
  }

  /**
   * Used by the MatTable. Called when it disconnects from the data source.
   *
   * @docs-private
   */
  disconnect() {
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = null;
  }
}
