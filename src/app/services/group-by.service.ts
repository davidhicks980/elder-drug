import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { SearchService } from './search.service';
import { TableService } from './table.service';

@Injectable()
export class GroupByService {
  private cache: Map<number, { grouped: string[]; ungrouped: string[] }> = new Map();
  private groupedItemSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private ungroupedItemSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  groupedItems$: Observable<string[]> = this.groupedItemSource.asObservable();
  ungroupedItems$ = this.ungroupedItemSource.asObservable();
  private grouped: string[] = [];
  private ungrouped: string[] = [];
  get groups() {
    return this.groupedItemSource.getValue().slice();
  }
  constructor(private tableService: TableService, private searchService: SearchService) {
    //When a new search is conducted, clear the group cache
    this.searchService.searchResults$.subscribe(() => {
      this.cache.clear();
    });
    //When the table changes, add from the group cache if the cache has items. Otherwise, add all new columns as ungrouped options
    this.tableService.selection$.subscribe(({ tableNumber, columns }) => {
      if (!this.cache.has(tableNumber)) {
        this.addUngroupedItems(columns);
      } else {
        this.addItems(this.cache.get(tableNumber), true);
      }
    });
    combineLatest([this.groupedItems$, this.ungroupedItems$]).subscribe(([grouped, ungrouped]) => {
      this.cache.set(tableService.table ?? 0, { grouped, ungrouped });
    });
  }
  addGroupedItems(items: string[]) {
    this.grouped = this.dedupeItems([...this.grouped, ...items]);
    this.emit('GROUPED');
  }
  addUngroupedItems(items: string[]) {
    this.ungrouped = this.dedupeItems([...this.ungrouped, ...items]);
    this.emit('UNGROUPED');
  }
  moveItemInList(grouped: boolean, from: number, to: number) {
    moveItemInArray(grouped ? this.grouped : this.ungrouped, from, to);
    this.emit(grouped ? 'GROUPED' : 'UNGROUPED');
  }
  transferItemBetweenLists(toGroup: boolean, fromIndex: number, toIndex: number) {
    transferArrayItem(
      toGroup ? this.ungrouped : this.grouped,
      toGroup ? this.grouped : this.ungrouped,
      fromIndex,
      toIndex
    );
    this.emit();
  }
  emit(only?: 'GROUPED' | 'UNGROUPED') {
    if (only != 'GROUPED') {
      this.ungroupedItemSource.next(this.ungrouped.slice());
    }
    if (only != 'UNGROUPED') {
      this.groupedItemSource.next(this.grouped.slice());
    }
  }

  private dedupeItems(list: string[]) {
    return list.filter((item, index) => list.indexOf(item) === index);
  }
  addItems(
    { ungrouped, grouped }: { ungrouped?: string[]; grouped?: string[] },
    clear: boolean = false
  ) {
    if (clear) {
      this.grouped.length = 0;
      this.ungrouped.length = 0;
    }
    if (Array.isArray(ungrouped)) {
      this.addUngroupedItems(ungrouped);
    }
    if (Array.isArray(grouped)) {
      this.addGroupedItems(grouped);
    }
  }
}
