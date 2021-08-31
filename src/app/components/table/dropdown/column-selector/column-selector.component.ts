import { Overlay } from '@angular/cdk/overlay';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ColumnService, DisplayedColumns } from '../../../../services/columns.service';

@Component({
  selector: 'elder-column-selector',
  template: `
    <div class="popup-background ">
      <mat-selection-list (selectionChange)="watchChanges($event)">
        <mat-list-option
          checkboxPosition="before"
          [value]="option.id"
          [selected]="option.selected"
          *ngFor="let option of options | async"
          >{{ option.id | caseSplit }}</mat-list-option
        >
      </mat-selection-list>
    </div>
  `,
  styleUrls: [`column-selector.component.scss`],
})
export class ColumnSelectorComponent {
  @Output() columnChange: EventEmitter<string[]> = new EventEmitter();
  @Output() columnChangeObserver = this.columnChange.asObservable();
  displayedOptions: Observable<string[]>;
  selectedOptions: Observable<string[]>;
  options: Observable<DisplayedColumns[]>;
  ////////////////////
  watchChanges(change: MatSelectionListChange) {
    const selections = change.source.selectedOptions.selected.map(
      (val) => val.value
    );
    this.columnService.updateSelectedColumns(selections);
    this.columnChange.emit(selections);
  }

  ngAfterViewInit() {
    this.selectedOptions
      .pipe(take(1))
      .subscribe((val) => this.columnChange.emit(val));
  }

  constructor(private columnService: ColumnService, public overlay: Overlay) {
    this.columnService.updateSelectedColumns(['']);

    this.options = this.columnService.observeColumns$;
    this.selectedOptions = this.columnService.observeColumns$.pipe(
      map((cols) => cols.filter((col) => col.selected).map((col) => col.id))
    );
  }
}
