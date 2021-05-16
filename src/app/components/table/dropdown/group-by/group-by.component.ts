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
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { fadeInTemplate } from '../../../../animations';
import { VERTICAL_ARROW_KEYS } from '../../../../constants/keys.constants';
import { ColumnService } from '../../../../services/columns.service';
import { GroupByService } from '../../../../services/group-by.service';
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
  @Output() groupChangeObserver = this.groupChange.asObservable();
  @ViewChildren('removeButton') removeButtons: QueryList<ElementRef>;
  @ViewChildren('addButton') addButtons: QueryList<ElementRef>;
  tabbableGroupedItem: number = 0;
  tabbableUngroupedItem: number = 0;

  block = false;
  groupedColumns = new BehaviorSubject([]);
  ungroupedColumns = new BehaviorSubject([]);
  changes = this.groupedColumns
    .asObservable()
    .pipe(map((groups) => groups.map((group) => group.replace(' ', ''))));
  pastGroups = new Set();
  public options: Observable<string[]>;
  canClick = new Map();
  draggableItem = -1;
  dropList: CdkDropList;
  destroyed = new Subject();

  ngOnDestroy() {
    this.destroyed.next(true);
  }
  closePanel() {
    this.popupService.triggerPopup(PopupActions.close);
  }

  stopMovingElement(elem) {
    this.renderer.removeClass(elem, CLASS_MOVEABLE);
  }
  startMovingElement(elem) {
    this.renderer.addClass(elem, CLASS_MOVEABLE);
  }
  _canElementMove(elem: HTMLElement) {
    return elem.classList.contains(CLASS_MOVEABLE);
  }
  handleGrouplistKeydown(
    $event: KeyboardEvent,
    list: ListElement,
    index: number
  ) {
    let elem = $event.target as HTMLElement;
    switch ($event.key) {
      case 'Enter':
      case ' ':
        this._canElementMove(elem)
          ? this.stopMovingElement(elem)
          : this.startMovingElement(elem);
        this._cdr.markForCheck();
        break;
      default:
        if (!VERTICAL_ARROW_KEYS.includes($event.key))
          this.stopMovingElement(elem);

        if (this._canElementMove(elem))
          this.handleMoveableItemKeypress($event, index, list, elem);
        else this.navigateListGrid($event, list, elem);
        break;
    }
  }
  _getRelativeIndices(list: any[], index: number) {
    const lastIndex = list.length - 1,
      isLast = index === lastIndex,
      isFirst = index === 0,
      nextIndex = isLast ? 0 : index + 1,
      previousIndex = isFirst ? lastIndex : index - 1;
    return { nextIndex, previousIndex };
  }
  _queryNavGridItem(group: HTMLElement, row: number, col: number) {
    const selector = `[data-grid-row="${row}"][data-grid-column="${col}"]`;
    return group.querySelector(selector) as HTMLElement;
  }
  navigateListGrid(
    event: KeyboardEvent,
    list: HTMLUListElement | HTMLOListElement,
    elem: HTMLElement
  ) {
    // if (this.arrowKeys.includes(event.key)) event.stopPropagation();

    const {
      row,
      column,
      nextRow,
      nextColumn,
      prevRow,
      prevColumn,
      isFirstColumn,
      isLastColumn,
    } = this._getRelativeItemPosition(elem, list);

    switch (event.key) {
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        const overflowRow = isLastColumn ? nextRow : row;
        this._queryNavGridItem(list, overflowRow, nextColumn).focus();
        break;
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        this._queryNavGridItem(list, nextRow, column).focus();
        break;

      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        const underflowRow = isFirstColumn ? prevRow : row;
        this._queryNavGridItem(list, underflowRow, prevColumn).focus();

        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        this._queryNavGridItem(list, prevRow, column).focus();

        break;

      case 'Esc': // IE/Edge specific value
      case 'Escape':
        list.parentElement.focus();
        this.popupService.triggerPopup(PopupActions.close);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }
  private _getRelativeItemPosition(
    elem: HTMLElement,
    list: HTMLUListElement | HTMLOListElement
  ) {
    const row = Number(elem.dataset.gridRow);
    const column = Number(elem.dataset.gridColumn);
    const rowLength = Number(list.dataset.gridRows);
    const columnLength = Number(list.dataset.gridColumns);
    const prevRow = row === 1 ? rowLength : row - 1;
    const prevColumn = column === 1 ? columnLength : column - 1;
    const nextRow = row === rowLength ? 1 : row + 1;
    const nextColumn = column === columnLength ? 1 : column + 1;
    const isLastRow = row === rowLength;
    const isLastColumn = column === columnLength;
    const isFirstRow = row === 1;
    const isFirstColumn = column === 1;
    return {
      row,
      column,
      nextRow,
      nextColumn,
      prevRow,
      prevColumn,
      isFirstRow,
      isFirstColumn,
      isLastRow,
      isLastColumn,
    };
  }

  handleMoveableItemKeypress(
    $event: KeyboardEvent,
    index: number,
    listElement: HTMLUListElement | HTMLOListElement,
    elem: any
  ) {
    $event.stopPropagation();

    const { nextIndex, previousIndex } = this._getRelativeIndices(
      Array.from(listElement.children),
      index
    );
    switch ($event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        this.moveItemInSubjectList(this.groupedColumns, index, nextIndex);
        this._cdr.markForCheck();
        this.startMovingElement(elem);

        setTimeout(() => {
          elem.focus();
        });
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        this.moveItemInSubjectList(this.groupedColumns, index, previousIndex);
        this._cdr.markForCheck();
        this.startMovingElement(elem);
        setTimeout(() => {
          elem.focus();
        });
        break;
      default:
        this.stopMovingElement(elem);

        return;
    }
  }
  transferItemToList(
    fromSubject: BehaviorSubject<string[]>,
    toSubject: BehaviorSubject<string[]>,
    from: number,
    to: number
  ) {
    const fromList = fromSubject.value,
      item = fromList.splice(from, 1)[0],
      toList = toSubject.value;
    toList.splice(to, 0, item);
    fromSubject.next(fromList);
    toSubject.next(toList);
    return { fromList, toList };
  }
  moveItemInSubjectList(
    list: BehaviorSubject<string[]>,
    from: number,
    to: number
  ) {
    let arr = list.value;
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      throw new Error('Please provide an array of string');
    }
    let value = arr.splice(from, 1)[0];
    arr.splice(to, 0, value);
    list.next(arr);
    return true;
  }

  blockPopupClose(container) {
    this.canClick.set(container, false);
    this.popupService.triggerPopup(PopupActions.preventClose);
  }
  groupItem(index: number) {
    this.groupedColumns.next([
      ...this.groupedColumns.value,
      this.ungroupedColumns.value.splice(index, 1)[0],
    ]);
  }
  ungroupItem(index: number) {
    const arr = this.groupedColumns.value;
    this.ungroupedColumns.next([
      ...this.ungroupedColumns.value,
      arr.splice(index, 1)[0],
    ]);
    this.groupedColumns.next(arr);
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
    const next = element.nextElementSibling;
    const prev = element.previousElementSibling;
    if (next) {
      (next as HTMLLIElement).focus();
    } else if (prev) {
      (prev as HTMLLIElement).focus();
    } else if (alternatives.length > 0) {
      for (let alt of alternatives) {
        if (alt) {
          alt.focus();
          return;
        }
      }
    } else {
      console.error(
        '[group-by.focusNextItem] connectedList is undefined. If you have a single-item list, the connected list should be defined to allow focus to be redirected'
      );
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const list = [this.groupedColumns, this.ungroupedColumns];
    const isItemGrouped = event.container.id === 'grouped-droplist';
    const [current, previous] = isItemGrouped ? list : list.reverse();

    if (event.previousContainer === event.container) {
      this.moveItemInSubjectList(
        current,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.transferItemToList(
        previous,
        current,
        event.previousIndex,
        event.currentIndex
      );
    }
    //Allow the popup to close after the item is transferred;
    this.popupService.triggerPopup(PopupActions.allowClose);
  }
  ngAfterViewInit() {
    this.options.pipe(take(1)).subscribe((val) => this.groupChange.emit(val));
  }

  watchChanges() {
    this.changes
      .pipe(takeUntil(this.destroyed), tap(console.log))
      .subscribe((groups) => this.groupService.changeGroups(groups));
  }

  constructor(
    private columnService: ColumnService,
    private popupService: PopupService,
    private _cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private groupService: GroupByService
  ) {
    this.options = this.columnService.observeActiveColumns$ || of(['']);

    this.options.pipe(takeUntil(this.destroyed)).subscribe((columnNames) => {
      columnNames = columnNames.map((val) =>
        val ? val.replace(/([A-Z])/g, ' $1').trim() : ''
      );
      this._addNewColumns(columnNames);
      this.ungroupedColumns.next(this._filterUngroupedItems(columnNames));
      this.groupedColumns.next(this._filterGroupedItems(columnNames));
    });
    this.canClick.set('grouped-droplist', true).set('ungrouped-droplist', true);
    this.watchChanges();
  }

  moveItems(list: string, index: number) {
    switch (list) {
      case 'ungrouped-droplist':
        this.groupItem(index);
        break;
      case 'grouped-droplist':
        this.ungroupItem(index);
        break;
    }
  }

  addGroupItem(group) {
    this.groupedColumns.next([...this.groupedColumns.value, group]);
  }
  addItem(group) {
    this.ungroupedColumns.next([...this.ungroupedColumns.value, group]);
  }
  emitGroupChange(groups) {
    this.groupService.changeGroups(groups);
  }
  private _addNewColumns(values: string[]) {
    const activeColumns = [
      ...this.groupedColumns.value,
      ...this.ungroupedColumns.value,
    ];

    for (const value of values) {
      if (!activeColumns.includes(value))
        if (this.pastGroups.has(value)) {
          this.addGroupItem(value);
          this.pastGroups.delete(value);
        } else {
          this.addItem(value);
        }
    }
  }
  private _filterUngroupedItems(values: string[]) {
    return this.ungroupedColumns.value.filter((ungrouped) =>
      values.includes(ungrouped)
    );
  }
  private _filterGroupedItems(values: string[]) {
    return this.groupedColumns.value.filter((grouped) => {
      if (!values.includes(grouped)) {
        this.pastGroups.add(grouped);
        return false;
      } else return true;
    });
  }
}
