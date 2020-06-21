import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { ParametersService } from 'src/app/parameters.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent {
  @ViewChild('columnSelect') selector: MatSelectChange;
  selectedOptions: string[];
  @Input() table: string;
  @Output() selected: EventEmitter<string[]> = new EventEmitter();
  displayedOptions: string[];
  controller: FormControl = new FormControl('');

  constructor(private parameterService: ParametersService) {}
}
