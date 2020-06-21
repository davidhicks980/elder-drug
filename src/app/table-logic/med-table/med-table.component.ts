import { Component, Input, ViewChild, OnChanges, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import {
  columnDefinition,
  ParametersService,
} from 'src/app/parameters.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { BeersEntry } from 'src/app/websocket.service';

@Component({
  selector: 'app-med-table',
  templateUrl: './med-table.component.html',
  styleUrls: ['./med-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed, void=>expanded',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MedTableComponent implements OnChanges, OnInit {
  @ViewChild('medTable') dataTable: MatTable<BeersEntry>;
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
