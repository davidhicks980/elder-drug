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
export class GroupByComponent implements OnDestroy, AfterViewInit {
  @Output() groupChange: EventEmitter<string[]> = new EventEmitter();
  @ViewChildren('removeButton') removeButtons: QueryList<ElementRef>;
  @ViewChildren('addButton') addButtons: QueryList<ElementRef>;
  @ViewChildren(KeyGridDirective)
  gridElements: QueryList<KeyGridDirective>;
  tabbableGroupedItem: number = 0;
  tabbableUngroupedItem: number = 0;
  pastGroups = new Set();
  options: Observable<string[]>;
  canClick = new Map();
  draggableItem = -1;
  dropList: CdkDropList;
  destroy$ = new Subject();

  groupItem(item: number) {
    this.groupService.groupItem(item);
  }
  ungroupItem(item: number) {
    this.groupService.ungroupItem(item);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
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
  handleGrouplistKeydown($event: KeyboardEvent, list: ListElement, index: number) {
    let { target, key } = $event;
    let elem = target as HTMLElement;
    if (ENTER_KEYS.includes(key)) {
      if (this.canElementMove(elem)) {
        this.stopMovingElement(elem);
      } else {
        this.startMovingElement(elem);
      }
      this.cdr.markForCheck();
    } else if (ARROW_KEYS.includes(key)) {
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
    this.groupService.moveItemsInGroupList(index, moveTo);
    this.cdr.markForCheck();
    this.startMovingElement(elem);
    requestAnimationFrame(() => {
      elem.focus();
    });
  }

  blockPopupClose(container) {
    this.canClick.set(container, false);
    this.popupService.emitAction(PopupActions.preventClose);
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
    const isItemGrouped = event.container.id === 'grouped-droplist';
    if (event.previousContainer === event.container) {
      if (isItemGrouped) {
        this.groupService.moveItemsInGroupList(event.previousIndex, event.currentIndex);
      } else {
        this.groupService.moveItemsInUngroupedList(event.previousIndex, event.currentIndex);
      }
    } else {
      this.groupService.transferItemBetweenLists(
        !isItemGrouped,
        event.previousIndex,
        event.currentIndex
      );
    }
    //Allow the popup to close after the item is transferred;
    this.popupService.emitAction(PopupActions.allowClose);
  }
  ngAfterViewInit() {
    this.updatePlaceholder(this.groupService.groups);
  }

  private updatePlaceholder(groups: string[]) {
    this.popupService.emitPlaceholder({
      text: groups[0],
      itemCount: groups.length,
    });
  }
  constructor(
    private popupService: PopupService,
    public groupService: GroupByService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private keyGridService: KeyGridService
  ) {
    this.canClick.set('grouped-droplist', true).set('ungrouped-droplist', true);
  }
}
