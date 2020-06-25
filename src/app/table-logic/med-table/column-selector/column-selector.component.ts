import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { ParametersService } from 'src/app/parameters.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent implements AfterViewInit {
  @ViewChild('columnSelect') selector: MatSelectChange;
  selectOptions: string[] = [null];
  @Input() table: string;
  @Output() columnUpdates: EventEmitter<string[]> = new EventEmitter();
  displayedOptions: string[];

  emitUpdatedColumns(cols) {
    this.columnUpdates.emit(cols);
  }

  ngAfterViewInit() {
    let columns = this.parameterService.columnDefinitions.filter((table) => {
      return table.name === this.table;
    })[0];
    this.selectOptions = columns.selectedColumns;
    this.displayedOptions = columns.columnOptions;
  }
  constructor(private parameterService: ParametersService) {}
}
