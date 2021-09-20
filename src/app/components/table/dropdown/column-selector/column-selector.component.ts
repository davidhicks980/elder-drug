import { Component, EventEmitter, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

import { ColumnService } from '../../../../services/columns.service';
import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'elder-column-selector',
  template: `
    <ng-container *elderLet="selected$ | async as selected">
      <div class="popup-background">
        <mat-selection-list (selectionChange)="handleSelectionChange($event)">
          <mat-list-option
            *ngFor="let option of options$ | async"
            checkboxPosition="before"
            [value]="option"
            [selected]="selected.includes(option)"
            >{{ option | caseSplit }}</mat-list-option
          >
        </mat-selection-list>
      </div></ng-container
    >
  `,
  viewProviders: [{ provide: PopupService, useClass: PopupService }],

  styleUrls: [`column-selector.component.scss`],
})
export class ColumnSelectorComponent {
  @Output() change: EventEmitter<string[]> = new EventEmitter();
  handleSelectionChange(change: MatSelectionListChange) {
    const selections = change.source.selectedOptions.selected.map(
      (val) => val.value
    );
    this.columnService.emitColumns(selections);
    this.change.emit(selections);
    this.popupService.emitPlaceholder({
      text: selections[0],
      itemCount: selections.length,
    });
  }

  get options$() {
    return this.columnService.columns$;
  }
  get selected$() {
    return this.columnService.selected$;
  }

  constructor(
    private columnService: ColumnService,
    private popupService: PopupService
  ) {}
}
