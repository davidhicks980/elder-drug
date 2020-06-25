import {
  Component,
  ViewChild,
  ViewEncapsulation,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { ColumnMode } from '@swimlane/ngx-datatable/';
import { Table } from 'primeng/table';

import { ParametersService } from 'src/app/parameters.service';

@Component({
  selector: 'app-med-table',
  templateUrl: './med-table.component.html',
  styleUrls: ['./med-table.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({ height: '0px', minHeight: '0', opacity: 0 })),
      state('active', style({ height: '*', opacity: 1 })),
      transition(
        'active <=> void, void=>active',
        animate('450ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MedTableComponent implements OnChanges, OnInit {
  @ViewChild('myTable') table: any;
  @Input() tableData: Table[];
  rows: any[] = [];
  loadingIndicator = true;
  reorderable = true;
  public columnOptions: { field: string; header: string }[];
  displayedColumns: string[];
  ColumnMode = ColumnMode;
  selectOptions: string[];
  tableName: string;
  hideContents: boolean;
  expandFieldData: { field: string; header: string }[];
  changeActiveColumns(cols: string[]) {
    this.columnOptions = this.parameterService.lookupColumns(cols);
  }
  ngOnInit() {
    this.tableName = this.tableData['key'];
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
    this.selectOptions.length = 0;
    for (let item of this.columnOptions) {
      this.selectOptions.push(item.field);
    }
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {}
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
