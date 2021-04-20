import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import EventEmitter from 'events';
import { Observable } from 'rxjs';
import { delayWhen, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import {
  ColumnService,
  DisplayedColumns,
} from '../../../services/columns.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-column-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent {
  @ViewChild(MatSelect) selector: MatSelect;
  @Input() tableName: number;
  @Output() columnUpdates = new EventEmitter();
  displayedOptions: Observable<string[]>;
  selectedOptions = [''];
  options: Observable<DisplayedColumns[]>;

  watchChanges(change: MatSelectChange) {
    this.selectedOptions = change.value;
    this.columnService.updateSelectedColumns(change.value);
  }

  get columnListener(): Observable<DisplayedColumns[]> {
    if (this.options) return this.options;
  }
  constructor(
    private columnService: ColumnService,
    private tables: TableService
  ) {
    this.options = this.columnService.observeColumns$;
  }
}
