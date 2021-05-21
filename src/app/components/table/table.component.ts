import { animate, state, style, transition, trigger } from '@angular/animations';
import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import { AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { slideDownAnimation } from '../../animations';
import { ARROW_KEYS } from '../../constants/keys.constants';
import { FilterDirective } from '../../directives/filter.directive';
import { KeyGridDirective } from '../../directives/keygrid.directive';
import { ColumnService } from '../../services/columns.service';
import { BeersEntry, BeersField, DataService } from '../../services/data.service';
import { GroupByService } from '../../services/group-by.service';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'elder-table',
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
    './table.row.component.scss',
    './table.cell.component.scss',
  ],

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
  ],
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren('headerCell', { read: ElementRef })
  sortableHeaders: QueryList<ElementRef>;
  @ViewChildren(FilterDirective)
  headers: QueryList<FilterDirective>;
  //HTMLSectionElement
  @ViewChild('elderTable') container: ElementRef;
  @ViewChildren(KeyGridDirective) grid: QueryList<ElementRef>;
  model: BeersTableDataSource<ExpandingEntry, Paginator>;
  selectedRow: any;
  _rowLength: number;
  _columnLength: number;
  gridCells: KeyGridDirective[];
  FIRST_ROW = 2;
  filterCells: Set<KeyGridDirective> = new Set();

  constructor(
    private columnService: ColumnService,
    private dataService: DataService,
    private table: TableService,
    private groupServ: GroupByService,
    private renderer: Renderer2
  ) {
    this.dataService = dataService;
    this.columnService = columnService;
    this.model = new BeersTableDataSource(
      this.dataService.tableSource as any,
      this.columnService.observeActiveColumns$
    );
    const groupChanges = this.groupServ.groupChanges.pipe(
      map((groups) => groups.map((group) => group.trim()))
    );
    groupChanges.subscribe((groups) => this.model.updateGroups(groups));

    this.table.tableFilter$.subscribe(({ column, term }) =>
      this.model.filter(column, term)
    );
  }
  ngAfterViewInit() {
    this.sort.initialized.subscribe(() => {
      this.model.sort = this.sort;
    });
    this.grid.changes.subscribe((newCells: QueryList<KeyGridDirective>) => {
      this.gridCells = newCells.toArray();
    });
  }

  getRowIndex(row: ExpandingEntry, add = 0) {
    return row._position.index + this.FIRST_ROW + add;
  }
  trackRowBy(_index, item: ExpandingEntry) {
    return (
      item._position.hash +
      item._position.expanded +
      item._position.parentExpanded
    );
  }
  rowIsEntry(_index, row: ExpandingEntry) {
    return row._position.isGroup === false;
  }

  parentIsExpanded(row: ExpandingEntry) {
    return this.model.checkIsParentExpanded(row);
  }
  rowIsGroup(_index, row: ExpandingEntry) {
    return row._position.isGroup === true;
  }
  updateFilterCells(cell: KeyGridDirective) {
    this.filterCells.add(cell);
  }
  handleGridNavigation(event: KeyboardEvent) {
    if (ARROW_KEYS.includes(event.key)) {
      this._handleArrowKeys(event);
    }
  }
  _handleArrowKeys(event: KeyboardEvent) {
    const cells = this._getKeyGridCells();
    const currentElem = event.target as HTMLElement;
    const row = Number(currentElem.getAttribute('row'));
    const col = Number(currentElem.getAttribute('column'));
    const { r, c } = this._getPositionFns(row, col);
    const colCount = c.count(cells, row);
    const rowCount = r.count(cells);
    let toRow = 0;
    let toCol = 0;
    let colAbove = 0;
    let colBelow = 0;
    switch (event.key) {
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        toRow = c.isLast(colCount) ? r.next(rowCount) : row;
        toCol = c.next(colCount);
        break;
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        toRow = r.next(rowCount);
        /**/ colBelow = c.count(cells, toRow);
        toCol = colBelow < col ? colBelow : col;
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        toRow = c.isFirst() ? r.prev(rowCount) : row;
        toCol = c.prev(c.count(cells, r.prev(rowCount)));
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        toRow = r.prev(rowCount);
        /**/ colAbove = c.count(cells, toRow);
        toCol = colAbove < col ? colAbove : col;
        break;
      default:
        return; // Quit if this doesn't handle the key event.
    }
    const predicate = (item) => item.column == toCol && item.row == toRow;
    const nextElem = cells.filter(predicate)[0].element;
    this.renderer.setAttribute(nextElem, 'tabindex', '0');
    this.renderer.setAttribute(currentElem, 'tabindex', '-1');
    nextElem.focus();
    return true;
  }
  getExpansionHeader = (row: RowGroupMixin) => row.groupHeader;

  private _getKeyGridCells(): KeyGridDirective[] {
    let filters = [];
    try {
      filters = this.headers.map(
        (header) => header?.filterRef?.instance?.grid
      ) as KeyGridDirective[];
    } catch (err) {
      throw new Error(err);
    }
    const cells =
      Array.isArray(filters) && filters.length > 0
        ? [...this.gridCells, ...filters]
        : this.gridCells;
    return cells;
  }

  private _getPositionFns(row: number, col: number) {
    ///////////////////////////////////////////////

    const r = {
      prev: (rowCount: number) => (row === 0 ? rowCount : row - 1),
      next: (rowCount: number): number => (row === rowCount ? 0 : row + 1),
      isLast: (rowCount: number): boolean => row === rowCount,
      isFirst: () => row === 0,
      count: (cells: KeyGridDirective[]) =>
        cells.sort(
          (a: KeyGridDirective, b: KeyGridDirective) => b.row - a.row
        )[0].row,
    };
    const c = {
      prev: (columnsInPreviousRow: number) =>
        col === 0 ? columnsInPreviousRow : col - 1,
      next: (columnsInRow: number) => (col === columnsInRow ? 0 : col + 1),
      isLast: (columnsInRow: number) => col === columnsInRow,
      isFirst: () => col === 0,
      count: (cells: KeyGridDirective[], rowIndex: number) =>
        cells.reduce(
          (count, item: KeyGridDirective) =>
            item.row === rowIndex && item.column > count ? item.column : count,
          -1
        ),
    };

    return { r, c };
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
  [key: string]: string;
}
export interface RowExpansionMixin {
  parentExpanded: boolean;
  layer: number;
  root: number;
  index: number;
  ////////////////
  id: string;
  parentId: string;
  ///////////////
  isGroup: boolean;
  hasParent: boolean;
  ///////////////
  hash?: string;
  expanded?: boolean;
}

export interface RowGroupMixin {
  field: string;
  groupHeader: string;
  rows: Entries[];
  _position: RowExpansionMixin;
}
export interface RowGroupMixin {
  _position: RowExpansionMixin;
}

export type ExpandingEntry = BeersField & { _position: RowExpansionMixin };
export type ExpandingGroup = RowGroupMixin;

const FIRST_NODE = {
  index: 0,
  rootIndex: 0,
  layer: 0,
  id: '',
  parentId: '',
};

/** Shared base class with MDC-based implementation. */
export class BeersTableDataSource<
  T,
  P extends Paginator
> extends DataSource<T> {
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<Map<string, string>>(
    new Map()
  );

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
  private _groupChange: BehaviorSubject<string[]> = new BehaviorSubject([]);

  private _dataLoaded = false;

  private _displayedColumn$: Observable<string[]> = of(['']);
  private _displayedColumns: string[] = [];

  expanded = new Set();
  //Whether to ONLY group expanded rows in the data pipeline. This could be helpful when
  _renderOnExpansion: boolean = false;
  expansionChange = new BehaviorSubject(new Set());

  /** Ingests a stream of any columns that are marked to be shown and that contain data
   * @property {headers} headers - A stream of headers from your table source.
   */
  observeColumnChanges(headers: Observable<string[]>) {
    this._displayedColumn$ = combineLatest([this._data, headers]).pipe(
      map((headers) => this._filterEmptyColumns(headers)),
      tap((headers) => (this._displayedColumns = headers))
    );
  }
  /**
   *
   * A list of table columns to display
   * @readonly
   * @memberof BeersTableDataSource
   */
  get displayedColumns$() {
    return this._displayedColumn$;
  }
  get displayedColumns() {
    return this._displayedColumns;
  }
  get rowUpdates() {
    return this._renderData.asObservable();
  }
  get displayedGroups() {
    return [...this._groupChange.value.values()];
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

  hashRow(rows: ExpandingEntry[]) {
    let encode = (row) => encodeURI(JSON.stringify(row));

    for (let row of rows) {
      row._position['hash'] = encode(row);
    }
    return rows;
  }
  get dataLoaded() {
    return this._dataLoaded;
  }

  /** Array of objects that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }
  set data(data: T[]) {
    this._data.next(data);
  }

  updateGroups(groups: string[]) {
    this._groupChange.next(groups);
  }

  checkIsGroup(_, rowData) {
    return rowData._position.isGroup;
  }
  checkIsRow(_, rowData) {
    return !rowData._position.isGroup;
  }
  checkIsExpanded(row) {
    return this.expansionChange.value.has(row._position.id);
  }
  checkIsParentExpanded = (row) =>
    !this.rowHasParent(row) ||
    this.expansionChange.value.has(row._position.parentId);

  rowHasParent = (row) => row._position.hasParent;

  expand(row: ExpandingEntry, $event) {
    const id = row._position.id;
    const expanded = this.expansionChange.value;
    expanded.has(id) ? expanded.delete(id) : expanded.add(id);
    this.expansionChange.next(expanded);
  }
  /**
   * Filter term that should be used to filter out objects from the data array. To override how
   * data objects match to this filter string, provide a custom function for filterPredicate.
   */
  get filters(): Map<string, string> {
    return this._filter.value;
  }
  filter(column: string, term: string) {
    if (typeof column === 'string' && typeof term === 'string') {
      const filters = this._filter.value;
      term.length < 1 ? filters.delete(column) : filters.set(column, term);
      this._filter.next(filters);
    }
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
   * @param filter Filter entry structured as [key: columnName, value: filterText] that has been set on the data source.
   * @returns Whether the filter matches against the data
   */
  filterPredicate: (data: T, filter: [string, string][]) => boolean = (
    data: T,
    filter: [string, string][]
  ): boolean => {
    return filter.every(
      ([key, value]) =>
        (data[key] as string).trim().toLowerCase().indexOf(value) != -1
    );
  };

  toBehaviorSubject<T>(observable: Observable<T>): BehaviorSubject<T> {
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
    this._data = this.toBehaviorSubject(dataStream);
    this.observeColumnChanges(columnStream);
    this._updateChangeSubscription();
  }
  private _createRow(item: BeersEntry) {
    const row = {
      ...item,
    };
    return row;
  }

  private _createGroup({ groupHeader, field, _position }) {
    const group = {
      groupHeader,
      field,
      _position,
    };

    return group;
  }
  _createRowId(rootIndex: number, layer: number, index: number) {
    return `${rootIndex}${layer}${index}`;
  }
  private _flattenNestedNodes(nodes: any[], stack = []) {
    nodes.forEach((item) => {
      const hasChildren = Array.isArray(item?.rows);
      //If this is the first layer, set the root to the index of the first item of the tree
      //If the item exists, has children and has an array of rows, recurse again until no children are present.
      if (hasChildren) {
        const group = this._createGroup(item);
        stack.push(group);
        this._flattenNestedNodes(item.rows, stack);
      } else if (typeof item === 'object') {
        const row = this._createRow(item);
        stack.push(row);
      } else
        throw new TypeError(
          '[BeersTableDataSource._flattenNestedNodes]: One or more nodes are not the correct type'
        );
    });

    return stack;
  }

  private _groupBy(
    entries: T[],
    fields: string[],
    root = 0,
    layer = 0,
    parentIndex = -1,
    parentId = ''
  ): any[] {
    let field = fields[0] as string; // take the next field
    if (!field) return entries; //if field does not exist, return the array
    /////////////////////////////
    ////////////////////////////
    const groupedEntries = entries.reduce(
      (levelGroups, levelEntry: T, groupIndex) => {
        //If you are on the first layer, set the rootIndex equal to the index of the top node
        //Index is horizontal (within a group), layer is vertical and ascending (the height of the tree node)
        let grouping = levelEntry[field];
        //Make the group name a string if it is an array
        if (Array.isArray(grouping)) {
          grouping = grouping.join('_');
        }
        if (!grouping) grouping = ' [[No data]]';
        //If current group does not exist, set the value to the current field, and provide empty rows at the bottom of the tree
        root = parentIndex === -1 ? groupIndex : root;
        let groupId = this._createRowId(root, layer, groupIndex);
        const groupPosition = {
          root,
          layer,
          index: groupIndex,
          isGroup: true,
          hasParent: layer > 0,
          expanded: false,
          id: groupId + parentId[2],
          parentId,
        } as RowExpansionMixin;
        //If a group has not been created in this layer, create an entry
        if (!levelGroups[grouping])
          levelGroups[grouping] = {
            rows: [],
            groupHeader: grouping,
            field,
            _position: groupPosition,
          };

        //If this is the last layer (there are no more fields to group), add a position to all row entries
        if (fields.length <= 1) {
          let index = levelGroups[grouping].rows.length;
          let parentId = levelGroups[grouping]._position.id;

          let id = this._createRowId(root, layer + 1, index);
          levelEntry['_position'] = {
            root,
            layer: layer + 1,
            index,
            isGroup: false,
            expanded: false,
            hasParent: true,
            id: id + parentId[2],
            parentId,
          } as RowExpansionMixin;
        }
        levelGroups[grouping].rows.push(levelEntry);
        return levelGroups;
      },
      {}
    );
    let groupedValues = Object.values(groupedEntries);

    if (fields.length) {
      layer++;
      groupedValues.forEach((group: any) => {
        let { index: _index, id: _id } = group._position;
        group.rows = this._groupBy(
          group.rows,
          fields.slice(1),
          root,
          layer,
          _index,
          _id
        );
      });
    }
    return groupedValues;
  }

  private _groupData(data: T[]) {
    let groups = this._groupChange.value;

    if (Array.isArray(groups) && groups.length > 0) {
      let nestedNodes = this._groupBy(data, groups);
      return this._flattenNestedNodes(nestedNodes);
    }
    data.forEach(
      (point, index) =>
        (point['_position'] = {
          root: 0,
          id: `00${index}`,
          parentId: '000',
          isGroup: false,
          layer: 0,
          expanded: false,
          hasParent: false,
          index,
        })
    );
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

    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([this._data, this._filter]).pipe(
      map(([data]) => this._filterData(data))
    );
    // Watch for filtered data or sort changes to provide an ordered set of data.
    const sortedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this._orderData(data))
    );

    const groupedData = combineLatest([sortedData, this._groupChange]).pipe(
      map(([data]) => this._groupData(data))
    );

    const hashedRows = groupedData.pipe(map((rows) => this.hashRow(rows)));
    const expandedData = combineLatest([hashedRows, this.expansionChange]).pipe(
      map(([data]) => this._expandData(data))
    );
    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = expandedData.subscribe((data) => {
      this._renderData.next(data as any);
    });
  }
  private _expandData(data: any[]): any {
    let expandedRows = this.expansionChange.value;
    let i = 0;
    data.forEach((row: ExpandingEntry) => {
      const { isGroup, id, parentId, layer } = row._position;
      let isFirstLayer = !layer || layer === 0;
      let isShown = expandedRows.has(parentId) || isFirstLayer;
      let isExpanded = expandedRows.has(id);
      if (!isShown && isExpanded) expandedRows.delete(id);
      row._position.expanded = isShown && isExpanded;
      row._position.parentExpanded = isShown;
      row._position.index = i;
      i = isExpanded && !isGroup ? i + 2 : i + 1;
    });
    return data.filter((data) => data._position.parentExpanded);
  }

  /**
   * Filters any columns that do not contain data
   *
   * @param {*} [tableArray, headers]
   * @returns {*}  {string[]}
   */
  private _filterEmptyColumns = ([tableArray, headers]: [
    T[],
    string[]
  ]): string[] => {
    let exists = {};
    let displayedColumns = tableArray
      .map((table) =>
        headers.filter((header) =>
          table[header] && !exists.hasOwnProperty(header)
            ? (exists[header] = true)
            : false
        )
      )
      .flat();
    return displayedColumns;
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

    if (this.filters.size === 0) {
      return data;
    } else {
      const filters = Array.from(this.filters.entries());
      return data.filter((obj) => this.filterPredicate(obj, filters));
    }
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
    return this._renderData.asObservable();
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
