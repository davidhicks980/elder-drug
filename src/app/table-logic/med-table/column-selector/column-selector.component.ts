import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { ColumnService } from 'src/app/columns.service';

import { FirebaseService, TableParameters } from '../../../firebase.service';

@Component({
  selector: 'app-column-selector',
  template: `<mat-form-field color="primary" *ngIf="selectOptions">
    <mat-label>Change Columns</mat-label>
    <mat-select
      #columnSelect
      class="column-select"
      multiple
      [ngModel]="selectOptions"
      (ngModelChange)="emitUpdatedColumns($event)"
    >
     
      <mat-option
        *ngFor="let column of displayedOptions | async"
        [value]="column"
      >
        {{ column | caseSplit }}
      </mat-option>
    </mat-select>
  </mat-form-field> `,
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent implements AfterViewInit {
  @ViewChild('columnSelect') selector: MatSelectChange;
  @Input() tableName: number;
  @Output() columnUpdates: EventEmitter<string[]> = new EventEmitter();
  @Output() loaded = new EventEmitter();
  displayedOptions: Observable<string[]>
  selectOptions: string[];
  selectedOptions: Observable<string[]>;

  emitUpdatedColumns(cols) {
    this.columnUpdates.emit(cols);
  }
  ngAfterViewInit() {
    this.selectedOptions.subscribe(item=>this.selectOptions = item)
    this.loaded.emit(true);
  }
  ngOnInit ()
  {
    const options = this.firebase.filteredFields$.pipe( filter( ( item: TableParameters ) => item.id === this.tableName ) )
    this.displayedOptions = options.pipe( pluck('fields') );
    this.selectedOptions = options.pipe(
      pluck('selected')
    );
   /* this.displayedOptions = this.firebase.filteredFields$.pipe( filter( item => item.id === this.tableName ), map( val => val.fields.entries() ), toArray() ).subscribe(item=>console.log(item))*/
}
  constructor(
    private columnService: ColumnService,
    public firebase: FirebaseService
  ) {
    this.columnService = columnService;
  }
}
