import { Component, ViewChild, Input, OnChanges, OnInit } from '@angular/core';

import { Table } from 'primeng/table';

import { ParametersService } from 'src/app/parameters.service';
import { slideDownAnimation } from '../../animations';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  expandButtonAnimation,
  translateRationaleContent,
} from '../../animations';

@Component({
  selector: 'app-med-table',
  templateUrl: './med-table.component.html',
  styleUrls: ['./med-table.component.scss'],
  animations: [
    expandButtonAnimation,
    translateRationaleContent,
    slideDownAnimation
  ],
})
export class MedTableComponent implements OnChanges, OnInit {
  @ViewChild('myTable') table: any;
  @Input() tableData: Table[];
  rows: any[] = [];
  public columnOptions: { field: string; header: string }[];
  displayedColumns: string[];
  selectOptions: string[] = [];
  tableName: string;
  expandFieldData: { field: string; header: string }[];
  loaded = false;
  public rationale: { expanded: boolean }[] = [];

  changeActiveColumns(cols: string[]) {
    this.columnOptions = this.parameterService.lookupColumns(cols);
  }
  expandRationale(index: number) {
    this.rationale[index].expanded = !this.rationale[index].expanded;
  }
  ngOnInit() {
    this.tableName = this.tableData['key'];
    const initOptions = this.parameterService.columnDefinitions.filter((item) => {
      return item.name === this.tableName;
    })[0];
    this.columnOptions = this.parameterService
      .lookupColumns(initOptions.selectedColumns)
      .filter(Boolean);
    this.expandFieldData = this.parameterService
      .lookupColumns(initOptions.columnOptions)
      .filter(Boolean);
    this.rows = this.tableData['value'];
    if (this.columnOptions) {
      for (const item of this.columnOptions) {
        this.selectOptions.push(item.field);
      }
    }
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle() {}
  constructor(public parameterService: ParametersService) {}

  ngOnChanges() {
    this.rows = this.tableData['value'];
    this.setExpandedVariables(this.rows);
  }

  private setExpandedVariables(rows: any[]) {
    for (let {} of rows) {
      this.rationale.push({ expanded: true });
    }
  }
}
