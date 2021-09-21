import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExpandingEntry } from './ExpandingEntry';
import { RowExpansionMixin } from './RowExpansionMixin';
import { FlatRowGroup, RowGroup } from './RowGroup';
import { TableEntry } from './TableEntry';

/** Shared base class with MDC-based implementation. */
export const MAX_SAFE_INTEGER = 9007199254740991;

export class BeersTableDataSource<T> extends DataSource<T> {
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly renderData = new BehaviorSubject<T[]>([]);

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
  private groupChange: BehaviorSubject<string[]> = new BehaviorSubject([]);

  private _displayedColumn$: Observable<string[]> = of(['']);
  private _displayedColumns: string[] = [];

  //Whether to ONLY group expanded rows in the data pipeline. This could be helpful when
  _renderOnExpansion: boolean = false;
  expansionChange = new BehaviorSubject(new Set());

  /** Ingests a stream of any columns that are marked to be shown and that contain data
   * @property {headers} headers - A stream of headers from your table source.
   */
  observeColumnChanges(headers: Observable<string[]>) {
    this._displayedColumn$ = headers;
    //TODO: remove
    this.displayedColumns$.subscribe(console.log);
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
    return this.renderData.asObservable();
  }
  get displayedGroups() {
    return [...this.groupChange.value.values()];
  }
  /** Array of objects that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }
  set data(data: T[]) {
    this._data.next(data);
  }
  updateGroups(groups: string[]) {
    this.groupChange.next(groups);
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
  checkIsParentExpanded = (row) => {
    return (
      !this.rowHasParent(row) ||
      this.expansionChange.value.has(row._position.parentId)
    );
  };

  rowHasParent = (row) => row._position.hasParent;

  expand(row: ExpandingEntry) {
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
    this.updateChangeSubscription();
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
  sortData: (data: TableEntry<T>[], sort: MatSort) => TableEntry<T>[] = (
    data: TableEntry<T>[],
    sort: MatSort
  ): TableEntry<T>[] => {
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
    return filter.every(([key, value]) => {
      return (data[key] as string).trim().toLowerCase().indexOf(value) != -1;
    });
  };

  constructor(dataStream: BehaviorSubject<T[]>) {
    super();
    this._data = dataStream;
    this.updateChangeSubscription();
  }

  private createGroup({ groupHeader, field, _position }) {
    return {
      groupHeader,
      field,
      _position,
    };
  }
  private getPositionId(rootIndex: number, layer: number, index: number) {
    return `${rootIndex}${layer}${index}`;
  }
  private flattenNestedNodes(
    nodes: (RowGroup<T> | TableEntry<T>)[]
  ): (TableEntry<T> | FlatRowGroup<T>)[] {
    return nodes.reduce((flatArray, item) => {
      const hasChildren = 'rows' in item && Array.isArray(item.rows);
      //If this is the first layer, set the root to the index of the first item of the tree
      //If the item exists, has children and has an array of rows, recurse again until no children are present.
      if (hasChildren) {
        item = item as RowGroup<T>;
        const group = this.createGroup(item),
          children = this.flattenNestedNodes(item.rows);
        flatArray.push(group, ...children);
      } else {
        flatArray.push(item);
      }
      return flatArray;
    }, []);
  }

  private nestGroupsBy(
    entries: (TableEntry<T> | RowGroup<T>)[],
    fields: string[],
    root = 0,
    layer = 0,
    parentIndex = -1,
    parentId = ''
  ): (RowGroup<T> | TableEntry<T>)[] {
    let field = fields[0] as string; // take the next field
    if (!field) {
      return entries;
    } //if field does not exist, return the array
    const groupedEntries = entries.reduce(
      (groupsOnLevel, levelEntry, groupIndex) => {
        //If we are at the top level, set the value to the current field, and provide empty rows at the bottom of the tree
        root = parentIndex === -1 ? groupIndex : root;
        let groupId = this.getPositionId(root, layer, groupIndex),
          groupTerm = levelEntry[field],
          hasParent = layer > 0,
          id = groupId + parentId[2];

        let groupPosition = {
          root,
          layer,
          index: groupIndex,
          id,
          hasParent,
          parentId,
          isGroup: true,
          expanded: false,
          parentExpanded: false,
        } as RowExpansionMixin;

        //If you are on the first layer, set the rootIndex equal to the index of the top node
        //Index is horizontal (within a group), layer is vertical and ascending (the height of the tree node)
        if (!groupTerm) {
          groupTerm = ' [[No data]]';
        }
        //Make the group name a string if it is an array
        if (Array.isArray(groupTerm)) {
          groupTerm = groupTerm.join('_');
        }
        //If a group has not been created in this layer, create an entry
        if (!groupsOnLevel[groupTerm]) {
          groupsOnLevel[groupTerm] = {
            rows: [],
            groupHeader: groupTerm,
            field,
            _position: groupPosition,
          };
        }
        //If this is the last layer (there are no more fields to group), add a position to all row entries
        if (fields.length <= 1) {
          let index = groupsOnLevel[groupTerm].rows.length,
            parentId = groupsOnLevel[groupTerm]._position.id,
            nodeId = this.getPositionId(root, layer + 1, index);
          levelEntry._position = {
            root,
            layer: layer + 1,
            index,
            isGroup: false,
            hasParent: true,
            id: nodeId + parentId[2],
            parentId,
          } as RowExpansionMixin;
        }
        groupsOnLevel[groupTerm].rows.push(levelEntry);
        return groupsOnLevel;
      },
      {}
    ) as { [key: string]: RowGroup<T> };
    let groupedValues = Object.values(groupedEntries);

    //If there are groups remaining, recursively run the groupby function
    if (fields.length) {
      layer++;
      groupedValues.forEach((group: RowGroup<T>) => {
        group.rows = this.nestGroupsBy(
          group.rows,
          fields.slice(1),
          root,
          layer,
          group._position.index,
          group._position.id
        );
      });
    }
    return groupedValues;
  }

  private groupData(data: TableEntry<T>[]) {
    let groups = this.groupChange.value;
    if (Array.isArray(groups) && groups.length > 0) {
      let nestedNodes = this.nestGroupsBy(data, groups);
      return this.flattenNestedNodes(nestedNodes);
    } else {
      return data;
    }
  }
  appendPosition(data: T[]): TableEntry<T>[] {
    return data.map((d, index) => {
      return Object.assign(d, {
        _position: {
          root: 0,
          id: `00${index}`,
          parentId: '000',
          isGroup: false,
          layer: 0,
          expanded: false,
          parentExpanded: false,
          hasParent: false,
          index,
        },
      });
    });
  }
  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter, sort, and pagination along with
   * the provided base data and send it to the table for rendering.
   */

  private updateChangeSubscription() {
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

    const dataWithPositionalMetadata = this._data.pipe(
      map((data) => this.appendPosition(data))
    );
    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([
      dataWithPositionalMetadata,
      this._filter,
    ]).pipe(map(([data]) => this.filterData(data)));
    // Watch for filtered data or sort changes to provide an ordered set of data.
    const sortedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this.orderData(data))
    );
    const groupedData = combineLatest([sortedData, this.groupChange]).pipe(
      map(([data]) => this.groupData(data))
    );
    const expandedData = combineLatest([
      groupedData,
      this.expansionChange,
    ]).pipe(map(([data]) => this.expandData(data)));
    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = expandedData.subscribe((data) => {
      this.renderData.next(data as any);
    });
  }
  private expandData(
    data: (TableEntry<T> | FlatRowGroup<T>)[]
  ): (TableEntry<T> | FlatRowGroup<T>)[] {
    let expandedRows = this.expansionChange.value;
    let i = 0;
    data.forEach((row) => {
      const { isGroup, id, parentId, layer } = row._position,
        isShown = expandedRows.has(parentId) || !layer,
        isExpanded = expandedRows.has(id);
      if (!isShown && isExpanded) {
        expandedRows.delete(id);
      }
      row._position.expanded = isShown && isExpanded;
      row._position.parentExpanded = isShown;
      row._position.index = i;
      //Expanded rows have two cells: the row cell, and the details cell. Hence, if isExpanded is true, move down by two to get to the next
      //expandable row.
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
    return tableArray
      .map((table) => {
        return headers.filter((header) => {
          return table[header] && !exists.hasOwnProperty(header)
            ? (exists[header] = true)
            : false;
        });
      })
      .flat();
  };

  /**
   * Returns a filtered data array where each filter object contains the filter string within
   * the result of the filterTermAccessor function. If no filter is set, returns the data array
   * as provided.
   */
  private filterData(data: TableEntry<T>[]): TableEntry<T>[] {
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
  private orderData(data: TableEntry<T>[]): TableEntry<T>[] {
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
      this.updateChangeSubscription();
    }
    return this.renderData.asObservable();
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
