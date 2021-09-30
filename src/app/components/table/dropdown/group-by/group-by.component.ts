import { trigger } from '@angular/animations';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
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
import { Observable, Subject } from 'rxjs';

import { enterLeaveFadeTemplate } from '../../../../animations/templates';
import { ARROW_KEYS, ENTER_KEYS } from '../../../../constants/keys.constants';
import { KeyGridDirective } from '../../../../directives/keygrid.directive';
import { GroupByService } from '../../../../services/group-by.service';
import { KeyGridService } from '../../../../services/key-grid.service';
import { PopupActions, PopupService } from '../../../../services/popup.service';

type ListElement = HTMLOListElement | HTMLUListElement;
export const CLASS_MOVEABLE = 'is-moveable';

@Component({
  selector: 'elder-group-by',
  templateUrl: './group-by.component.html',
  styleUrls: ['./group-by.component.scss'],
  animations: [trigger('fadeInPill', enterLeaveFadeTemplate('300ms ease-out', '300ms ease-out'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupByComponent implements OnDestroy {
  @Output() groupChange: EventEmitter<string[]> = new EventEmitter();
  @ViewChildren('removeButton') removeButtons: QueryList<ElementRef>;
  @ViewChildren('addButton') addButtons: QueryList<ElementRef>;
  @ViewChildren(KeyGridDirective)
  gridElements: QueryList<KeyGridDirective>;
  tabbableGroupedItem: number = 0;
  tabbableUngroupedItem: number = 0;
  pastGroups = new Set();
  options: Observable<string[]>;
  canClick = new Set();
  draggableItem = -1;
  dropList: CdkDropList;
  destroy$ = new Subject();
  groupListId = 'groupList';
  ungroupListId = 'ungroupList';
  ungroup(index: number) {
    this.groupService.transferItemBetweenLists(false, index, 0);
  }
  group(index: number) {
    this.groupService.transferItemBetweenLists(true, index, 0);
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

  stopMovingElement(elem: HTMLElement) {
    this.renderer.removeClass(elem, CLASS_MOVEABLE);
    this.cdr.markForCheck();
  }
  startMovingElement(elem: HTMLElement) {
    this.renderer.addClass(elem, CLASS_MOVEABLE);
    this.cdr.markForCheck();
  }
  canElementMove(elem: HTMLElement) {
    return elem.classList.contains(CLASS_MOVEABLE);
  }
  handleGrouplistKeydown($event: KeyboardEvent, list: ListElement, index: number) {
    let { target, key } = $event,
      elem = target as HTMLElement,
      canMove = this.canElementMove(elem);
    if (ARROW_KEYS.includes(key)) {
      if (canMove) {
        this.handleArrowKeypress($event, index, list, elem);
      } else {
        this.navigateListGrid($event, list);
      }
    } else if (ENTER_KEYS.includes(key)) {
      if (!canMove) {
        this.startMovingElement(elem);
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

  navigateListGrid(event: KeyboardEvent, list: HTMLUListElement | HTMLOListElement) {
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

  handleArrowKeypress(
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
      elem.focus();
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
    private keyGridService: KeyGridService
  ) {
    this.allowClicks(this.groupListId);
    this.allowClicks(this.ungroupListId);
  }
}
