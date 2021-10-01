import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/table';
import { MatSort, Sort } from '@angular/material/sort';
import stableStringify from 'json-stable-stringify';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExpandingEntry } from './ExpandingEntry';
import { FlatRowGroup, RowGroup } from './RowGroup';
import { TableEntry } from './TableEntry';

/** Shared base class with MDC-based implementation. */
export const MAX_SAFE_INTEGER = 9007199254740991;
export const HIGHLIGHT_START = '◬hl◬';
export const HIGHLIGHT_END = '◬hle◬';
export const HIGHLIGHT_REGEX = RegExp(
  `${HIGHLIGHT_START}([\w\s',./;+=\-_"]+)${HIGHLIGHT_END}`,
  'gi'
);
export class BeersTableDataSource<T> extends DataSource<T> {
  private dataSource: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private renderData = new BehaviorSubject<T[]>([]);
  private readonly filterSource = new BehaviorSubject<string>('');
  private renderChangesSubscription: Subscription | null = null;
  private groupSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private columnSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private expansionSource = new BehaviorSubject('');
  private expandedRows: Set<string> = new Set();
  columns$ = this.columnSource.asObservable();
  updateColumns(headers: string[]) {
    this.columnSource.next(headers);
  }
  updateData(data: T[]) {
    if (!this.renderChangesSubscription) {
      this.updateChangeSubscription();
    }
    this.dataSource.next(data);
  }

  updateGroups(groups: string[]) {
    this.groupSource.next(groups);
  }

  checkIsExpanded(row: TableEntry<T> | FlatRowGroup<T>) {
    return this.expandedRows.has(row.position.id);
  }
  checkIsRowShown(row: TableEntry<T> | FlatRowGroup<T>) {
    return this.expandedRows.has(row.position.parentId) || row.position.parentId.length === 0;
  }
  checkIsParentExpanded = (row: TableEntry<T> | FlatRowGroup<T>) => {
    return this.expandedRows.has(row.position.parentId);
  };
  collapseChildren(id: string) {
    this.expandedRows = new Set(Array.from(this.expandedRows).filter((ids) => !ids.startsWith(id)));
  }

  toggle(row: ExpandingEntry) {
    const { id } = row.position;
    this.expandedRows.has(id) ? this.collapseChildren(id) : this.expandedRows.add(id);
    console.log(this.expandedRows);
    this.expansionSource.next(id);
  }
  get filters(): string {
    return this.filterSource.value;
  }
  filter(term: string) {
    if (typeof term === 'string') {
      this.filterSource.next(term);
    }
  }

  get sort(): MatSort | null {
    return this._sort;
  }
  set sort(sort: MatSort | null) {
    this._sort = sort;
    this.updateChangeSubscription();
  }
  private _sort: MatSort | null;

  private sortingDataAccessor(fields: T, sortHeaderId: string): string | number {
    const value = fields[sortHeaderId];
    if (_isNumberValue(value)) {
      const numberValue = Number(value);
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }
    return value;
  }

  sortData(data: T[], sort: MatSort): T[] {
    const { active, direction } = sort;
    if (!active || direction == '') {
      return data;
    }
    return data
      .map((entry) => ({ ...entry }))
      .sort((a, b) => {
        let valueA = this.sortingDataAccessor(a, active);
        let valueB = this.sortingDataAccessor(b, active);
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
        let comparatorResult = 0;
        if (valueA != null && valueB != null) {
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
  }

  filterPredicate(fields: T, filter: string): boolean {
    const dataStr = Object.keys(fields)
      .reduce((currentTerm: string, key: string) => {
        return currentTerm + (fields as { [key: string]: any })[key] + '◬';
      }, '')
      .toLowerCase();
    const transformedFilter = filter.trim().toLowerCase();
    return dataStr.indexOf(transformedFilter) != -1;
  }
  constructor() {
    super();
    this.updateChangeSubscription();
  }

  private createRowGroups(
    entries: T[],
    groupedFields: string[],
    parentId = ''
  ): (FlatRowGroup<T> | TableEntry<T>)[] {
    let field = '',
      fields = groupedFields.slice(),
      index = 0,
      groups = new Map() as Map<string, RowGroup<T>>;
    if (fields.length) {
      field = fields.shift();
    } else {
      return this.positionEntries(entries, parentId);
    }
    for (let entry of entries) {
      let groupHeader = entry[field] ?? 'None',
        shallowEntry = { ...entry };
      if (groups.has(groupHeader)) {
        groups.get(groupHeader).rows.push(shallowEntry);
      } else {
        groups.set(groupHeader, {
          field,
          groupHeader,
          rows: [shallowEntry],
          position: {
            id: `${parentId}:${index}`,
            parentId,
            isGroup: true,
            hasParent: !!parentId.length,
          },
        });
        index++;
      }
    }

    let flatRows = [] as (FlatRowGroup<T> | TableEntry<T>)[];
    for (let { rows, field, groupHeader, position } of groups.values()) {
      let children = this.createRowGroups(rows, fields, position.id);
      let parent = { field, groupHeader, position };
      flatRows = [...flatRows, parent, ...children];
    }

    return flatRows;
  }

  private positionEntries(entries: T[], parentId = ''): (TableEntry<T> | RowGroup<T>)[] {
    return entries.map((entry, index) => {
      return {
        fields: { ...entry },
        position: {
          id: `${parentId}:${index}`,
          parentId,
          isGroup: false,
          hasParent: !!parentId.length,
        },
      };
    });
  }

  private groupData(data: T[]) {
    let dataCopy = data.map((value) => ({ ...value })),
      groups = this.groupSource.value.slice();
    if (Array.isArray(groups) && groups.length > 0) {
      return this.createRowGroups(dataCopy, groups);
    } else {
      return this.appendPosition(dataCopy);
    }
  }
  appendPosition(data: T[]): TableEntry<T>[] {
    return data.map((fields, index) => {
      return {
        fields,
        position: {
          id: `${index}`,
          parentId: '',
          isGroup: false,
          hasParent: false,
        },
      };
    });
  }

  private updateChangeSubscription() {
    const sortChange: Observable<Sort | null | void> = this._sort
      ? (merge(this._sort.sortChange, this._sort.initialized) as Observable<Sort | void>)
      : of(null);

    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([this.dataSource, this.filterSource]).pipe(
      map(([data]) => this.filterData(data))
    );
    // Watch for filtered data or sort changes to provide an ordered set of data.
    const sortedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this.orderData(data))
    );
    const groupedData = combineLatest([sortedData, this.groupSource]).pipe(
      map(([data]) => this.groupData(data))
    );
    const hashedData = groupedData.pipe(map((data) => this.hashData(data)));
    const expandedData = combineLatest([hashedData, this.expansionSource]).pipe(
      map(([data]) => this.expandData(data))
    );

    // Watched for paged data changes and send the result to the table to render.
    this.renderChangesSubscription?.unsubscribe();
    this.renderChangesSubscription = expandedData.subscribe(
      (data: (TableEntry<T> | FlatRowGroup<T>)[]) => {
        this.renderData.next(data as any);
      }
    );
  }

  checkIsGroup(row: TableEntry<T> | FlatRowGroup<T>): boolean {
    return row.position.isGroup;
  }
  fastHash(str: string): string {
    let h = 0;
    for (let i = 0, j = str.length; i < j; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return String(h);
  }

  hashData<Row extends TableEntry<T> | FlatRowGroup<T>>(entries: Row[]): Row[] {
    return entries.map((entry) => {
      let position = { ...entry.position },
        compoundKey = { term: '', position };
      if (!this.checkIsGroup(entry)) {
        const { SearchTerms, EntryID } = (entry as TableEntry<T>).fields as Partial<{
          SearchTerms: string;
          EntryID: number;
        }>;
        compoundKey.term = SearchTerms + EntryID;
      } else {
        const { field, groupHeader } = entry as FlatRowGroup<T>;
        compoundKey.term = field + groupHeader;
      }
      position.hash = this.fastHash(stableStringify(compoundKey));
      return { ...entry, position };
    });
  }

  expandData(entries: (TableEntry<T> | FlatRowGroup<T>)[]) {
    return entries.filter((entry) => {
      let { parentId } = entry?.position;
      return this.expandedRows.has(parentId) || parentId.length === 0;
    });
  }
  private filterData(data: T[]): T[] {
    let filter = this.filterSource.value;
    return filter == null || filter === ''
      ? data
      : data.filter((obj) => this.filterPredicate(obj, filter));
  }

  private orderData(data: T[]): T[] {
    if (!this.sort) {
      return data;
    }
    return this.sortData(data, this.sort);
  }

  connect() {
    if (!this.renderChangesSubscription) {
      this.updateChangeSubscription();
    }

    return this.renderData;
  }

  disconnect() {
    this.renderChangesSubscription?.unsubscribe();
    this.renderChangesSubscription = null;
  }
}
