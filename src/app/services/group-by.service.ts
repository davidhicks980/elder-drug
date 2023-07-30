import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { destroy } from '../functions/destroy';

import { SearchService } from './search.service';
import { TableService } from './table.service';

enum DragLists {
  GROUPED,
  UNGROUPED,
}
type ToggleGroup = {
  group: string;
  enabled: boolean;
};

@Injectable()
export class GroupByService {
  private cache: Map<number, ToggleGroup[]> = new Map();
  private groupSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  items$: Observable<string[]> = this.groupSource
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (previous, next) =>
          previous.length === next.length && previous.every((item, i) => item[i] === next[i])
      )
    );
  /**
   * Stream containing column names and whether they are currently grouped
   *
   * @type {Observable<ToggleGroup[]>}
   * @memberof GroupByService
   */
  groups$: Observable<ToggleGroup[]> = this.groupSource
    .asObservable()
    .pipe(
      map((groups) => groups.map((group) => ({ group, enabled: this.enabledGroups.has(group) })))
    );
  ungroupedItems$ = this.groups$.pipe(
    map((items) => items.filter((item) => !item.enabled).map(({ group }) => group)),
    debounceTime(150)
  );
  groupedItems$ = this.groups$.pipe(
    map((items) => items.filter((item) => item.enabled).map(({ group }) => group)),
    debounceTime(150)
  );
  destroy$ = new Subject();
  enabledGroups: Set<string> = new Set();
  get groupedItems() {
    return this.groupSource.getValue().filter((item) => this.enabledGroups.has(item));
  }
  get ungroupedItems() {
    return this.groupSource.getValue().filter((item) => !this.enabledGroups.has(item));
  }
  get items() {
    return this.groupSource.getValue().slice();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
  constructor(private tableService: TableService, private searchService: SearchService) {
    //When a new search is conducted, clear the group cache
    this.searchService.searchResults$.pipe(destroy(this)).subscribe(() => {
      this.cache.clear();
    });
    //When the table changes, add from the group cache if the cache has items. Otherwise, add all new columns as ungrouped options
    this.tableService.selection$.pipe(destroy(this)).subscribe(({ tableNumber, columns }) => {
      if (!this.cache.has(tableNumber)) {
        this.addItems(
          columns.map((group) => ({ group, enabled: false })),
          true
        );
      } else {
        this.addItems(this.cache.get(tableNumber), true);
      }
    });

    this.groups$.pipe(destroy(this)).subscribe((groups) => {
      this.cache.set(tableService.table || 0, groups);
    });
  }
  private initializeEnabledGroups(entries: ToggleGroup[], clear: boolean = false) {
    if (clear) {
      this.enabledGroups.clear();
    }
    entries.filter((item) => item.enabled).map((item) => this.enabledGroups.add(item.group));
  }

  moveItem(fromIndex: number, toIndex: number) {
    let copy = this.items || []; //this.items returns a shallow copy of array;
    moveItemInArray(copy, fromIndex, toIndex);
    this.emit(copy);
  }
  get toggledGroups() {
    return this.enabledGroups;
  }

  toggleGroup(group: string, force?: boolean) {
    (typeof force === 'boolean' ? force : this.enabledGroups.has(group))
      ? this.enabledGroups.delete(group)
      : this.enabledGroups.add(group);
    this.emit(this.items);
  }
  emit(update: string[]) {
    this.groupSource.next(update);
  }

  addItems(items: ToggleGroup[], clear: boolean = false) {
    this.initializeEnabledGroups(items);
    let groups = items.map((item) => item.group);
    this.groupSource.next(clear ? groups.slice() : [...this.items, ...groups.slice()]);
  }
}
