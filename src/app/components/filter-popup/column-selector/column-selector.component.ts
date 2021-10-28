import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

import { ColumnService } from '../../../services/columns.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'elder-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: [`column-selector.component.scss`],
})
export class ColumnSelectorComponent implements OnDestroy {
  @Output() change: EventEmitter<string[]> = new EventEmitter();
  handleSelectionChange(change: MatSelectionListChange) {
    const selections = change.source.selectedOptions.selected.map((val) => val.value);
    this.change.emit(selections);
  }

  ngOnDestroy() {
    this.change.complete();
  }
  constructor(public columnService: ColumnService, public layoutService: LayoutService) {
    this.change
      .asObservable()
      .subscribe((selections) => this.columnService.emitColumns(selections));
  }
}
