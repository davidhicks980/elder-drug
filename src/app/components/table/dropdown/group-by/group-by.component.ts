import { trigger } from '@angular/animations';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { fadeInTemplate } from '../../../../animations/templates';
import { ARROW_KEYS, ENTER_KEYS, VERTICAL_ARROW_KEYS } from '../../../../constants/keys.constants';
import { KeyGridDirective } from '../../../../directives/keygrid.directive';
import { ColumnService } from '../../../../services/columns.service';
import { GroupByService } from '../../../../services/group-by.service';
import { KeyGridService } from '../../../../services/key-grid.service';
import { PopupActions, PopupService } from '../../../../services/popup.service';

type ListElement = HTMLOListElement | HTMLUListElement;
export const CLASS_MOVEABLE = 'is-moveable';

@Component({
  selector: 'elder-group-by',
  templateUrl: './group-by.component.html',
  styleUrls: ['./group-by.component.scss'],
  animations: [
    trigger('fadeInPill', fadeInTemplate('300ms ease-out', '300ms ease-out')),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupByComponent implements OnDestroy, AfterViewInit {
  @Output() groupChange: EventEmitter<string[]> = new EventEmitter();
  @ViewChildren('removeButton') removeButtons: QueryList<ElementRef>;
  @ViewChildren('addButton') addButtons: QueryList<ElementRef>;
  @ViewChildren(KeyGridDirective)
  gridElements: QueryList<KeyGridDirective>;
  tabbableGroupedItem: number = 0;
  tabbableUngroupedItem: number = 0;
  private groupedColumnSource: BehaviorSubject<string[]> = new BehaviorSubject(
    []
  );
  groupedColumns$ = this.groupedColumnSource.asObservable();
  private ungroupedColumnSource: BehaviorSubject<string[]> =
    new BehaviorSubject([]);
  ungroupedColumns$ = this.ungroupedColumnSource.asObservable();
  changes = this.groupedColumns$.pipe(
    map((groups) => groups.map((group) => group.trim()))
  );
  pastGroups = new Set();
  options: Observable<string[]>;
  canClick = new Map();
  draggableItem = -1;
  dropList: CdkDropList;
  destroyed = new Subject();

  ngOnDestroy() {
    this.destroyed.next(true);
  }
  closePanel() {
    this.popupService.emitAction(PopupActions.close);
  }
  stopMovingElement(elem: HTMLElement) {
    this.renderer.removeClass(elem, CLASS_MOVEABLE);
  }
  startMovingElement(elem: HTMLElement) {
    this.renderer.addClass(elem, CLASS_MOVEABLE);
  }
  canElementMove(elem: HTMLElement) {
    return elem.classList.contains(CLASS_MOVEABLE);
  }
  handleGrouplistKeydown(
    $event: KeyboardEvent,
    list: ListElement,
    index: number
  ) {
    let { target, key } = $event;
    let elem = target as HTMLElement;
    if (ENTER_KEYS.includes(key)) {
      if (this.canElementMove(elem)) {
        this.stopMovingElement(elem);
      } else {
        this.startMovingElement(elem);
      }
      this.cdr.markForCheck();
    } else if (VERTICAL_ARROW_KEYS.includes(key)) {
      if (this.canElementMove(elem)) {
        this.handleVerticalKeypressOnMoveableItem($event, index, list, elem);
      } else {
        this.navigateListGrid($event, list);
      }
    } else {
      this.stopMovingElement(elem);
    }
  }
  getSiblingItemIndices(list: any[], index: number) {
    const lastIndex = list.length - 1,
      isLast = index === lastIndex,
      isFirst = index === 0,
      next = isLast ? 0 : index + 1,
      previous = isFirst ? lastIndex : index - 1;
    return { next, previous };
  }

  navigateListGrid(
    event: KeyboardEvent,
    list: HTMLUListElement | HTMLOListElement
  ) {
    let { key } = event;
    if (ARROW_KEYS.includes(key)) {
      const listElements = this.gridElements.filter((directive) => {
        return list.contains(directive.element);
      });
      this.keyGridService.handleArrowKeys(event, listElements);
    } else if (key === 'Esc' || key === 'Escape') {
      list.parentElement.focus();
      this.popupService.emitAction(PopupActions.close);
    }
  }

  handleVerticalKeypressOnMoveableItem(
    $event: KeyboardEvent,
    index: number,
    listElement: HTMLUListElement | HTMLOListElement,
    elem: any
  ) {
    $event.stopPropagation();
    let { key } = $event;
    let listChildren = Array.from(listElement.children) as HTMLElement[];
    const { next, previous } = this.getSiblingItemIndices(listChildren, index);
    let moveTo = 0;
    if (key === 'Down' || key === 'ArrowDown') {
      moveTo = next;
    }
    if (key === 'Up' || key === 'ArrowUp') {
      moveTo = previous;
    }
    this.moveItemInList(this.groupedColumnSource, index, moveTo);
    this.cdr.markForCheck();
    this.startMovingElement(elem);
    requestAnimationFrame(() => {
      elem.focus();
    });
  }
  transferListItem(
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
  moveItemInList(list: BehaviorSubject<string[]>, from: number, to: number) {
    let li = list.value,
      value = li.splice(from, 1)[0];
    li.splice(to, 0, value);
    list.next(li);
    return true;
  }

  blockPopupClose(container) {
    this.canClick.set(container, false);
    this.popupService.emitAction(PopupActions.preventClose);
  }
  groupItem(index: number) {
    const ungrouped = this.ungroupedColumnSource.value;
    this.groupedColumnSource.next([
      ...this.groupedColumnSource.value,
      ungrouped.splice(index, 1)[0],
    ]);
    this.ungroupedColumnSource.next(ungrouped);
  }
  ungroupItem(index: number) {
    const grouped = this.groupedColumnSource.value;
    this.ungroupedColumnSource.next([
      ...this.ungroupedColumnSource.value,
      grouped.splice(index, 1)[0],
    ]);
    this.groupedColumnSource.next(grouped);
  }
  /**
   *
   *
   * @param {HTMLElement} element
   * @param {HTMLElement[]} alternatives - array of alternative focusable elements.
   * @returns {void}
   * @memberof GroupByComponent
   */
  focusNextItem(element: HTMLElement, ...alternatives: HTMLElement[]): any {
    const next = element.nextElementSibling as HTMLLIElement;
    const prev = element.previousElementSibling as HTMLLIElement;
    if (next) {
      next.focus();
    } else if (prev) {
      prev.focus();
    } else if (alternatives?.length > 0) {
      while (alternatives.length) {
        alternatives.pop().focus();
        return;
      }
    } else {
      console.error(
        '[group-by.focusNextItem] connectedList is undefined. If you have a single-item list, the connected list should be defined to allow focus to be redirected'
      );
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const list = [this.groupedColumnSource, this.ungroupedColumnSource];
    const isItemGrouped = event.container.id === 'grouped-droplist';
    const [current, previous] = isItemGrouped ? list : list.reverse();

    if (event.previousContainer === event.container) {
      this.moveItemInList(current, event.previousIndex, event.currentIndex);
    } else {
      this.transferListItem(
        previous,
        current,
        event.previousIndex,
        event.currentIndex
      );
    }
    //Allow the popup to close after the item is transferred;
    this.popupService.emitAction(PopupActions.allowClose);
  }
  ngAfterViewInit() {
    this.options.pipe(take(1)).subscribe((val) => this.groupChange.emit(val));
  }

  constructor(
    private columnService: ColumnService,
    private popupService: PopupService,
    private groupService: GroupByService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private keyGridService: KeyGridService
  ) {
    this.columnService.columns$
      .pipe(
        takeUntil(this.destroyed),
        map((groups) => groups.map(this.formatGroupNames))
      )
      .subscribe((columns) => {
        this.insertNewColumns(columns);
      });
    this.canClick.set('grouped-droplist', true).set('ungrouped-droplist', true);
    this.changes
      .pipe(
        takeUntil(this.destroyed),
        map((groups) => groups.map((group) => group.trim()))
      )
      .subscribe((groups) => {
        this.popupService.emitPlaceholder({
          text: groups[0],
          itemCount: groups.length,
        });
        this.groupService.emitGroupChange(groups);
      });
  }
  formatGroupNames(name: string) {
    return name?.replace(/([A-Z])/g, ' $1').trim() || '';
  }

  addGroupedColumn(group: string[]) {
    this.groupedColumnSource.next([
      ...this.groupedColumnSource.value,
      ...group,
    ]);
  }
  addUngroupedColumn(group: string[]) {
    this.ungroupedColumnSource.next([
      ...this.ungroupedColumnSource.value,
      ...group,
    ]);
  }
  emitGroupChange(groups) {
    this.groupService.emitGroupChange(groups);
  }
  private insertNewColumns(columns: string[]) {
    this.addUngroupedColumn(
      columns.filter((col) => {
        return !(
          this.groupedColumnSource.value.includes(col) &&
          this.ungroupedColumnSource.value.includes(col)
        );
      })
    );
  }
}
