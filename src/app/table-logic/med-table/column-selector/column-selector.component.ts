import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { ParametersService } from 'src/app/parameters.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent {
  @ViewChild('columnSelect') selector: MatSelectChange;
  @Input()
  public set tableName(name: string) {
    const columns = this.parameterService.columnDefinitions.filter((table) => {
      return table.name === name;
    })[0];
    this.selectOptions = columns.selectedColumns;
    this.displayedOptions = columns.columnOptions;
  }
  @Output() columnUpdates: EventEmitter<string[]> = new EventEmitter();
  displayedOptions: string[];
  selectOptions: string[] = [null];

  emitUpdatedColumns(cols) {
    this.columnUpdates.emit(cols);
  }

  constructor(private parameterService: ParametersService) {}
}
