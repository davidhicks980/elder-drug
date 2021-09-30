import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GroupByService {
  private groupedItemSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  /**
   * An observable containing the groupings displayed in the drug table.
   * @readonly
   * @memberof GroupByService
   */
  groupedItems$: Observable<string[]> = this.groupedItemSource.asObservable();
  private ungroupedItemSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  ungroupedItems$ = this.ungroupedItemSource.asObservable();
  grouped: string[] = [];
  ungrouped: string[] = [];
  get groups() {
    return this.groupedItemSource.getValue();
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
    return list.filter((item, i) => list.indexOf(item) === i);
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
