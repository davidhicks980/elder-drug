import { trigger } from '@angular/animations';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { enterLeaveFadeTemplate } from '../../../animations/templates';
import { Keys, WHITESPACE_KEYS } from '../../../constants/keys.constants';
import { KeyGridDirective } from '../../../directives/keygrid.directive';
import { destroy } from '../../../functions/destroy';
import { GroupByService } from '../../../services/group-by.service';
import { KeyGridService } from '../../../services/key-grid.service';
import { PopupActions, PopupService } from '../../../services/popup.service';

type ListElement = HTMLOListElement | HTMLUListElement;
export const CLASS_MOVEABLE = 'is-moveable';
type DropListTabIndices = { grouped: number; ungrouped: number };
@Component({
  selector: 'elder-group-fields',
  templateUrl: './group-fields.component.html',
  styleUrls: ['./group-fields.component.scss'],
  animations: [trigger('fadeInPill', enterLeaveFadeTemplate('300ms ease-out', '300ms ease-out'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: KeyGridService, useClass: KeyGridService }],
})
export class GroupFieldsComponent implements OnDestroy, AfterViewInit {
  @Output() groupChange: EventEmitter<string[]> = new EventEmitter();
  @ViewChildren('ungroupAddButton', { read: ElementRef }) ungroupedList: QueryList<
    ElementRef<HTMLElement>
  >;
  @ViewChildren('groupRemoveButton', { read: ElementRef }) groupedList: QueryList<
    ElementRef<HTMLElement>
  >;
  @ViewChildren(KeyGridDirective)
  gridElements: QueryList<KeyGridDirective>;
  private tabbableItemSource: BehaviorSubject<DropListTabIndices> = new BehaviorSubject({
    grouped: 0,
    ungrouped: 0,
  });
  tabbableItem$ = this.tabbableItemSource.asObservable();
  canClick = new Set();
  dropList: CdkDropList;
  destroy$ = new Subject();
  groupListId = 'groupList';
  ungroupListId = 'ungroupList';
  activeList: 'grouped' | 'ungrouped' = 'grouped';

  get groupedTabIndex() {
    return this.tabbableItemSource.value.grouped;
  }
  get ungroupedTabIndex() {
    return this.tabbableItemSource.value.ungrouped;
  }
  ungroup(index: number) {
    this.groupService.transferItemBetweenLists(false, index, 0);
    this.activeList = 'grouped';
  }
  group(index: number) {
    this.groupService.transferItemBetweenLists(true, index, 0);
    this.activeList = 'ungrouped';
  }
  private inferTabIndex(grouped: keyof DropListTabIndices) {
    return function (this: GroupFieldsComponent, items: QueryList<ElementRef<HTMLButtonElement>>) {
      let limit = items?.length - 1;
      let currentIndex = grouped === 'grouped' ? this.groupedTabIndex : this.ungroupedTabIndex;
      let nextIndex = currentIndex <= limit ? currentIndex : 0;
      this.updateTabIndex(nextIndex, grouped);
      if (this.activeList === grouped) {
        items.get(nextIndex)?.nativeElement?.focus();
        this.activeList = undefined;
      }
    };
  }
  ngAfterViewInit() {
    this.ungroupedList.changes
      .pipe(destroy(this))
      .subscribe(this.inferTabIndex('ungrouped').bind(this));
    this.groupedList.changes
      .pipe(destroy(this))
      .subscribe(this.inferTabIndex('grouped').bind(this));
  }
  getListIcon(listItemRef: HTMLElement) {
    return listItemRef.classList.contains('is-moveable') ? 'unfold_more' : 'draggable';
  }
  ngOnDestroy() {
    this.destroy$.next(true);
  }
  closePanel() {
    this.popupService.emitAction(PopupActions.close);
  }

  stopMovingElement(element: HTMLElement) {
    this.renderer.removeClass(element, CLASS_MOVEABLE);
    this.cdr.markForCheck();
  }
  startMovingElement(element: HTMLElement) {
    this.renderer.addClass(element, CLASS_MOVEABLE);
    this.cdr.markForCheck();
  }
  canElementMove(element: HTMLElement) {
    return element.classList.contains(CLASS_MOVEABLE);
  }
  handleGroupItemKeydown(event: KeyboardEvent, list: ListElement, index: number) {
    let { target, key } = event;
    let element = target as HTMLElement;
    let canMove = this.canElementMove(element);
    let { ARROWS, ENTER, SPACEBAR, TAB, ESCAPE } = Keys;
    if (ARROWS.includes(key)) {
      if (canMove) {
        this.handleArrowKeysOnMoveableItem(event, index, list, element);
      } else {
        this.navigateListGrid(event, list);
      }
    } else if ([ENTER, ...SPACEBAR].includes(key)) {
      if (canMove) {
        this.stopMovingElement(element);
      } else {
        this.startMovingElement(element);
      }
      if (element instanceof HTMLLIElement) event.preventDefault();
    } else if ([TAB, ...ESCAPE].includes(key)) {
      if (canMove) {
        this.stopMovingElement(element);
      }
      if (key === TAB) {
        if (this.ungroupedList.length - 1 < this.ungroupedTabIndex) {
          this.updateTabIndex(0, 'ungrouped');
        }
      }
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

  navigateListGrid(event: KeyboardEvent, list: HTMLUListElement) {
    let { key } = event;
    if (Keys.ARROWS.includes(key)) {
      const items = this.gridElements.filter((directive) => list.contains(directive.element));
      let { toRow } = this.keyGridService.handleArrowKeys(event, items, true, true);
      this.updateTabIndex(toRow, list.id === this.groupListId ? 'grouped' : 'ungrouped');
    } else if (Keys.ESCAPE.includes(key)) {
      list.parentElement.focus();
      this.popupService.emitAction(PopupActions.close);
    }
  }

  handleArrowKeysOnMoveableItem(
    $event: KeyboardEvent,
    index: number,
    listElement: HTMLUListElement | HTMLOListElement,
    elem: any
  ) {
    $event.stopPropagation();
    let { key } = $event,
      listItems = Array.from(listElement.children) as HTMLElement[],
      moveTo = 0,
      { next, previous } = this.getSiblingItemIndices(listItems, index);
    if (key === 'Down' || key === 'ArrowDown') {
      moveTo = next;
    }
    if (key === 'Up' || key === 'ArrowUp') {
      moveTo = previous;
    }
    this.groupService.moveItemInList(true, index, moveTo);
    this.cdr.markForCheck();
    this.startMovingElement(elem);
    requestAnimationFrame(() => {
      elem?.focus();
    });
  }

  allowClicks(containerId: string) {
    this.canClick.add(containerId);
  }
  denyClicks(containerId: string) {
    this.canClick.delete(containerId);
  }
  blockPopupClose() {
    this.popupService.emitAction(PopupActions.preventClose);
  }
  get isGroupClickable() {
    return this.canClick.has(this.groupListId);
  }
  get isUngroupClickable() {
    return this.canClick.has(this.ungroupListId);
  }

  focusItem(index: number, list: QueryList<ElementRef<HTMLElement>>): void {
    list.get(index)?.nativeElement?.focus();
  }
  updateGroupedTabIndex(index: number) {
    this.tabbableItemSource.next({
      grouped: index,
      ungrouped: this.tabbableItemSource.value.ungrouped,
    });
  }
  updateTabIndex(index: number, listName: keyof DropListTabIndices) {
    let indices = { ...this.tabbableItemSource.value };
    indices[listName] = index;
    this.tabbableItemSource.next(indices);
  }

  drop(event: CdkDragDrop<string[]>) {
    const droppedOnGroup = event.container.id === this.groupListId,
      transfer = event.previousContainer.id != event.container.id,
      { previousIndex, currentIndex } = event;
    if (transfer) {
      this.groupService.transferItemBetweenLists(droppedOnGroup, previousIndex, currentIndex);
    } else {
      this.groupService.moveItemInList(droppedOnGroup, previousIndex, currentIndex);
    }
    //Allow the popup to close after the item is transferred;
    this.popupService.emitAction(PopupActions.allowClose);
  }

  constructor(
    private popupService: PopupService,
    public groupService: GroupByService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(KeyGridService) private keyGridService: KeyGridService
  ) {
    this.allowClicks(this.groupListId);
    this.allowClicks(this.ungroupListId);
  }
}
