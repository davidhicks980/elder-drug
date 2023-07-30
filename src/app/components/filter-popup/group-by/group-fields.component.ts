import { trigger } from '@angular/animations';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Observable, queueScheduler, Subject } from 'rxjs';
import { debounceTime, observeOn, take } from 'rxjs/operators';

import { enterLeaveFadeTemplate } from '../../../animations/templates';
import { Keys } from '../../../constants/keys.constants';
import { KeyGridDirective } from '../../../directives/keygrid.directive';
import { GroupByService } from '../../../services/group-by.service';
import { KeyGridService } from '../../../services/key-grid.service';
import { PopupActions, PopupService } from '../../../services/popup.service';

export const CLASS_MOVEABLE = 'is-moveable';
@Component({
  selector: 'elder-group-fields',
  templateUrl: './group-fields.component.html',
  styleUrls: ['./group-fields.component.scss'],
  animations: [trigger('fadeInPill', enterLeaveFadeTemplate('300ms ease-out', '300ms ease-out'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: KeyGridService, useClass: KeyGridService }],
})
export class GroupFieldsComponent implements OnDestroy {
  @Output() groupChange: EventEmitter<string[]> = new EventEmitter();
  items$: Observable<{ group; selected }[]>;
  @HostListener('keydown.Escape')
  handleEscape() {
    this.popupService.emitAction(PopupActions.close);
  }
  @ViewChildren(KeyGridDirective)
  dragElements: QueryList<KeyGridDirective>;
  canClick = new Set();
  dropList: CdkDropList;
  destroy$ = new Subject();
  groupListId = 'groupList';
  keydownSource: Subject<Event> = new Subject();
  moveableSource: BehaviorSubject<string> = new BehaviorSubject('');
  moveable$ = this.moveableSource.asObservable();
  keydown$ = this.keydownSource.asObservable();
  checked: boolean = false;

  ngOnDestroy() {
    this.destroy$.next(true);
  }
  closePanel() {
    this.popupService.emitAction(PopupActions.close);
  }

  emitKeydown($event: Event) {
    this.keydownSource.next($event);
  }
  canElementMove(group: string) {
    return this.moveableSource.value === group;
  }
  toggleMovement(group: string) {
    this.moveableSource.next(this.moveableSource.value === group ? '' : group);
  }
  toggleGroup($event, group: string) {
    this.groupService.toggleGroup(group);
    this.renderer.setProperty($event.target, 'checked', this.groupService.enabledGroups.has(group));
    this.cdr.detectChanges();
  }
  handleGroupItemKeydown(event: KeyboardEvent, group: string, index: number) {
    let { key } = event;
    let canMove = this.canElementMove(group);
    if (canMove) {
      event.preventDefault();
      let { length } = this.groupService.items;
      let isFirst = index === 0;
      let isLast = index === length - 1;

      switch (key) {
        case 'ArrowDown':
          this.groupService.moveItem(index, isLast ? 0 : index + 1);
          break;
        case 'ArrowUp':
          this.groupService.moveItem(index, isFirst ? length - 1 : index - 1);
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          this.toggleMovement(group);
          this.keydownSource.next(event);
          return;
        default:
          return;
      }
      this.cdr.detectChanges();
      Promise.resolve().then(() => {
        this.cdr.detectChanges();
        this.focusMoveableItem();
      });
    } else {
      this.keydownSource.next(event);
    }
  }

  focusMoveableItem() {
    this.dragElements.find((element) => element.name === this.moveableSource.value).focusElement();
  }
  navigateListGrid(event: KeyboardEvent, list: HTMLUListElement) {
    let { key } = event;
    if (Keys.ESCAPE.includes(key)) {
      list.parentElement.focus();
    }
  }

  blockPopupClose() {
    this.popupService.emitAction(PopupActions.preventClose);
  }

  drop(event: CdkDragDrop<string[]>) {
    const { previousIndex, currentIndex } = event;
    this.groupService.moveItem(previousIndex, currentIndex);
    //Allow the popup to close after the item is transferred;
    this.popupService.emitAction(PopupActions.allowClose);
  }

  constructor(
    private popupService: PopupService,
    public groupService: GroupByService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}
}
