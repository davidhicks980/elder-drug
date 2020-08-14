import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { Table } from 'primeng/table';

import { ParametersService } from 'src/app/parameters.service';

@Component({
  selector: 'app-med-table',
  templateUrl: './med-table.component.html',
  styleUrls: ['./med-table.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ height: '*' })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({
          height: '0px',
        }),
        animate(150),
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave', animate(150, style({ opacity: 0 }))),
    ]),
  ],
})
export class MedTableComponent implements OnChanges, OnInit, AfterViewInit {
  @ViewChild('myTable') table: any;
  @Input() tableData: Table[];
  rows: any[] = [];
  public columnOptions: { field: string; header: string }[];
  displayedColumns: string[];
  selectOptions: string[];
  tableName: string;
  expandFieldData: { field: string; header: string }[];
  changeActiveColumns(cols: string[]) {
    this.columnOptions = this.parameterService.lookupColumns(cols);
  }
  ngOnInit() {
    this.tableName = this.tableData['key'];
  }

  ngAfterViewInit() {
    let initOptions = this.parameterService.columnDefinitions.filter((item) => {
      return item.name === this.tableName;
    })[0];
    this.columnOptions = this.parameterService
      .lookupColumns(initOptions.selectedColumns)
      .filter(Boolean);
    this.expandFieldData = this.parameterService
      .lookupColumns(initOptions.columnOptions)
      .filter(Boolean);
    this.rows = this.tableData['value'];
    for (let item of this.columnOptions) {
      this.selectOptions.push(item.field);
    }
  }
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle() {}
  constructor(public parameterService: ParametersService) {}
  ngOnChanges() {
    this.rows = this.tableData['value'];
  }
}

/* @ViewChild('medTable') dataTable: MatTable<BeersEntry>;
  @Input() dataSource: MatTableDataSource<BeersEntry>;
  selectedColumns: string[];
  @Input() name: string;
  @Input() description: string;
  @Input() filters: string[];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  expandedMeds;
  loading: boolean = true;
  activeTables: columnDefinition[];
  columns: columnDefinition;

  updateColumns(list) {
    this.selectedColumns = list;
  }

  constructor(private parameterService: ParametersService) {}
  ngOnChanges() {
    this.dataTable.renderRows();
  }
  ngOnInit() {
    this.columns = this.parameterService.columnDefinitions.filter((def) => {
      return def.name == this.name;
    })[0];
    this.filters = this.columns.filters;
    this.selectedColumns = this.columns.selectedColumns;
    this.dataSource.sort = this.sort;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
}
*/
