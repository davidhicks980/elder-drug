import {
  FocusMonitor,
  ListKeyManager,
} from '@angular/cdk/a11y';
import {
  CdkDragDrop,
  CdkDropList,
  DropListRef,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ColumnService } from '../../../../services/columns.service';
import { PopupActions, PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'elder-group-by',
  template: `
    <div
      cdkTrapFocus
      cdkTrapFocusAutoCapture
      cdkDropListGroup
      class="group-row group-row__background"
    >
      <h3 class="group-row__primary-header">Row Groups</h3>
      <h4 class="group-row__secondary-header">Grouped Rows</h4>

      <ol
        cdkDropList
        [cdkDropListData]="groupedColumns"
        [cdkDropListConnectedTo]="[ungrouped]"
        (cdkDropListDropped)="drop($event)"
        #grouped="cdkDropList"
        class="drop-zone"
        role="listbox"
        id="grouped-droplist"
        [style.pointerEvents]="canClick.get(grouped.id) ? 'all' : 'none'"
      >
        <li
          cdkDrag
          role="option"
          *ngFor="let option of groupedColumns; index as i"
          class="list-item grouped"
          cdkDragBoundary=".group-row"
          (cdkDragStarted)="blockClicks(grouped.id)"
          (cdkDragEnded)="canClick.set(grouped.id, true)"
          (keydown.space)="ungroupItem(i)"
          tabindex="0"
        >
          <span class="list-item__sub-header" matLine>{{ i + 1 }} | </span>

          <span class="list-item__header" matLine>{{ option }}</span>
        </li>
      </ol>
      <mat-divider></mat-divider>
      <h4 class="group-row__secondary-header">Ungrouped Rows</h4>

      <ul
        cdkDropList
        [cdkDropListData]="ungroupedColumns"
        [cdkDropListConnectedTo]="[grouped]"
        (cdkDropListDropped)="drop($event)"
        #ungrouped="cdkDropList"
        role="listbox"
        class="ungrouped-list"
        id="ungrouped-droplist"
        [style.pointerEvents]="canClick.get(ungrouped.id) ? 'all' : 'none'"
      >
      <li
          cdkDrag
          role="option"
          *ngFor="let item of ungroupedColumns; index as i"
          class="list-item ungrouped"
          cdkDragBoundary=".group-row"
          tabindex="0"
          (cdkDragStarted)="blockClicks(ungrouped.id)"
          (cdkDragEnded)="canClick.set(ungrouped.id, true)"
          (keydown)="handleNavKeys($event, i, ungrouped)"
        >
        <div class="list-item__pill-layout"><span class="list-item__header" matLine>{{ item }}</span>
             <mat-icon
                class="list-item__add-icon"
                inline="true"
                svgIcon="add--outline"
              ></mat-icon>    </div>
          

        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./group-by.component.scss'],
})
export class GroupByComponent {
  @ViewChild('.list-item', { read: ElementRef }) listItem: ElementRef;
  @ViewChildren('ungrouped') dropLists: DropListRef;
  @Output() groupChange: EventEmitter<string[]> = new EventEmitter();
  @Output() groupChangeObserver = this.groupChange.asObservable();
  block = false;
  groupedColumns = [];
  ungroupedColumns = [];
  pastGroups = new Set();
  public options: Observable<string[]>;
  listManager: ListKeyManager<any>;
  canClick = new Map();
  blockClicks(container) {
    this.canClick.set(container, false);
   this.popupService.triggerPopup(PopupActions.preventClose);
  }
  groupItem(index: number) {
    this.groupedColumns.push(this.ungroupedColumns.splice(index, 1));
  }
  ungroupItem(index: number) {
    this.ungroupedColumns.push(this.groupedColumns.splice(index, 1));
  }

  toggle(option: string) {
    let index = this.groupedColumns.indexOf(option);
    index > -1
      ? this.groupedColumns.slice(index)
      : this.groupedColumns.push(option);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.popupService.triggerPopup(PopupActions.allowClose);
  }
  ngAfterViewInit() {
    this.options.pipe(take(1)).subscribe((val) => this.groupChange.emit(val));
  }

  watchChanges(change: MatSelectionListChange) {
    const selections = change.source.selectedOptions.selected.map(
      (val) => val.value
    );
    this.groupChange.emit(selections);
  }

  constructor(
    private columnService: ColumnService,
    private popupService: PopupService,
    private focusMonitor: FocusMonitor
  ) {
    this.options = this.columnService.observeActiveColumns$ || of(['']);

    this.options.subscribe((columnNames) => {
      columnNames = columnNames.map((val) =>
        val ? val.replace(/([A-Z])/g, ' $1').trim() : ''
      );
      this._addNewColumns(columnNames);
      this.ungroupedColumns = this._filterUngrouped(columnNames);
      this.groupedColumns = this._filterGrouped(columnNames);
      console.log(this.dropLists);
    });
    this.canClick.set('grouped-droplist', true).set('ungrouped-droplist', true);
  }

  moveItems(){
 switch (dropList.element.nativeElement.id) {
          case 'ungrouped-droplist':
            this.groupItem(index);
            break;
          case 'grouped-droplist':
            this.ungroupItem(index);
            break;
        }
  }
  handleNavKeys($event, index, dropList: CdkDropList) {
    let items = dropList.getSortedItems();
    let lastItem = items.length - 1;
    let isLastItem = index === lastItem;
    let isFirstItem = index === 0;
    let nextItem = isLastItem ? 0 : index + 1;
    let previousItem = isFirstItem ? lastItem : index - 1;
    const moveTo = (elem: number) => {
      this.focusMonitor.focusVia(items[elem].getRootElement(), 'keyboard');
    };

    switch ($event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        moveTo(nextItem);

        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        moveTo(previousItem);

        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        moveTo(previousItem);

        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        moveTo(nextItem);

        break;
        case 'Space':
        moveTo(nextItem);

        break;
      case 'Enter':
        moveTo(nextItem)
        this.moveItems


        break;
      case 'Esc': // IE/Edge specific value
      case 'Escape':
        this.popupService.triggerPopup(PopupActions.close);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }
  private _addNewColumns(values: string[]) {
    let activeColumns = [...this.groupedColumns, ...this.ungroupedColumns];

    for (let value of values) {
      if (!activeColumns.includes(value))
        if (this.pastGroups.has(value)) {
          this.groupedColumns.push(value);
          this.pastGroups.delete(value);
        } else {
          this.ungroupedColumns.push(value);
        }
    }
  }
  private _filterUngrouped(values: string[]) {
    return this.ungroupedColumns.filter((ungrouped) =>
      values.includes(ungrouped)
    );
  }
  private _filterGrouped(values: string[]) {
    return this.groupedColumns.filter((grouped) => {
      if (!values.includes(grouped)) {
        this.pastGroups.add(grouped);
        return false;
      } else return true;
    });
  }
}
