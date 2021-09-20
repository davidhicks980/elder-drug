import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { KeyGridDirective } from '../../../directives/keygrid.directive';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @ViewChild(KeyGridDirective) grid: KeyGridDirective;
  @Input() column: string = '';
  @Input() gridRow: number = 0;
  @Input() gridColumn: number = 0;
  @Output() filterInstantiated = new EventEmitter();
  filter({ target }: Event) {
    const term = (target as HTMLInputElement).value;
    this.tableService.emitTableFilter({ column: this.column, term });
  }

  constructor(private tableService: TableService) {}
}
