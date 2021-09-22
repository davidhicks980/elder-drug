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
  get groups() {
    return this.groupedItemSource.getValue();
  }

  groupItem(index: number) {
    const ungrouped = this.ungroupedItemSource.value;
    this.groupedItemSource.next([...this.groupedItemSource.value, ungrouped.splice(index, 1)[0]]);
    this.ungroupedItemSource.next(ungrouped);
  }
  ungroupItem(index: number) {
    const grouped = this.groupedItemSource.value;
    this.ungroupedItemSource.next([...this.ungroupedItemSource.value, grouped.splice(index, 1)[0]]);
    this.groupedItemSource.next(grouped);
  }
  addGroupedItems(group: string[]) {
    this.groupedItemSource.next([...this.groupedItemSource.value, ...group]);
  }
  addUngroupedItems(group: string[]) {
    this.ungroupedItemSource.next([...this.ungroupedItemSource.value, ...group]);
  }

  private transferListItem(
    from: BehaviorSubject<string[]>,
    to: BehaviorSubject<string[]>,
    fromIndex: number,
    toIndex: number
  ) {
    const fromList = from.value,
      item = fromList.splice(fromIndex, 1)[0],
      toList = to.value;
    toList.splice(toIndex, 0, item);
    from.next(fromList);
    to.next(toList);
    return { fromList, toList };
  }
  private moveItemInList(list: BehaviorSubject<string[]>, from: number, to: number) {
    let li = list.value,
      value = li.splice(from, 1)[0];
    li.splice(to, 0, value);
    list.next(li);
    return true;
  }
  transferItemBetweenLists(fromUngroupedList: boolean, fromIndex: number, toIndex: number) {
    let lists = [this.groupedItemSource, this.ungroupedItemSource];
    if (fromUngroupedList) {
      lists.reverse();
    }
    const [previous, current] = lists;
    this.transferListItem(previous, current, fromIndex, toIndex);
  }

  moveItemsInGroupList(from: number, to: number) {
    this.moveItemInList(this.groupedItemSource, from, to);
  }
  moveItemsInUngroupedList(from: number, to: number) {
    this.moveItemInList(this.ungroupedItemSource, from, to);
  }

  private dedupeItems(list: string[]) {
    return list.filter((item, i) => list.indexOf(item) === i);
  }
  addItems({ ungrouped, grouped }: { ungrouped?: string[]; grouped?: string[] }, newList = false) {
    let hasGrouped = Array.isArray(grouped);
    let hasUngrouped = Array.isArray(ungrouped);
    if (newList) {
      if (hasUngrouped) {
        this.ungroupedItemSource.next(ungrouped);
      }
      if (hasGrouped) {
        this.groupedItemSource.next(grouped);
      }
    } else {
      let dedupe = this.dedupeItems;
      if (hasUngrouped) {
        let items = this.ungroupedItemSource.getValue();
        this.ungroupedItemSource.next(dedupe([...items, ...ungrouped]));
      }
      if (hasGrouped) {
        let items = this.groupedItemSource.getValue();
        this.groupedItemSource.next(dedupe([...items, ...grouped]));
      }
    }
  }
  constructor() {}
}
