import { Component, ViewChild, Input, OnChanges, OnInit } from '@angular/core';

import { Table } from 'primeng/table';

import { ParametersService } from 'src/app/parameters.service';
import { slideDownAnimation } from '../../animations';
import {
  expandButtonAnimation,
  translateRationaleContent,
} from '../../animations';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-med-table',
  templateUrl: './med-table.component.html',
  styleUrls: ['./med-table.component.scss'],
  animations: [
    expandButtonAnimation,
    translateRationaleContent,
    slideDownAnimation,
  ],
})
export class MedTableComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @Input() tableData: Table[];
  public rows: any[] = [];
  public columnOptions: { field: string; header: string }[];
  public displayedColumns: string[];
  public selectOptions: string[] = [];
  public tableName: string;
  public expandFieldData: { field: string; header: string }[];
  public loaded: boolean = false;
  public selectorInitiated: boolean = false;

  public rationale: { expanded: boolean }[] = [];
  sidenavActive: boolean;
  smallScreen: boolean;
  columns: string[];
  cols: {}[];
  changeActiveColumns(cols: string[]) {
    this.columnOptions = this.parameterService.lookupColumns(cols);
    this.cols = this.formatColumns(
      this.columnOptions.map((item) => item.field)
    );
    this.rows = this.tableData['value'].reduce((acc, item) => {
      let out = {};
      Object.entries(item).map(([key, val]) => {
        if (key && this.columns.includes(key)) {
          out[key] = val;
        }
      });
      acc.push(out);
      return acc;
    }, []);
  }
  expandRationale(index: number) {
    this.rationale[index].expanded = !this.rationale[index].expanded;
  }
  ngOnInit() {
    this.tableName = this.tableData['key'];
    const initOptions = this.parameterService.columnDefinitions.filter(
      (item) => {
        return item.name === this.tableName;
      }
    )[0];
    this.columnOptions = this.parameterService
      .lookupColumns(initOptions.selectedColumns)
      .filter(Boolean);

    this.columns = this.columnOptions.map((item) => item.field);
    this.expandFieldData = this.parameterService
      .lookupColumns(initOptions.columnOptions)
      .filter(Boolean);
    this.rows = this.tableData['value'].reduce((acc, item) => {
      let out = {};
      Object.entries(item).map(([key, val]) => {
        if (key && this.columns.includes(key)) {
          out[key] = val;
        }
      });
      acc.push(out);
      return acc;
    }, []);
    this.cols = this.formatColumns(this.columns);
    if (this.columnOptions) {
      for (const item of this.columnOptions) {
        this.selectOptions.push(item.field);
      }
    }
  }

  formatColumns(cols) {
    return cols.map((col) => {
      return { prop: `${col}` };
    });
  }

  onDetailToggle() {}
  constructor(
    public parameterService: ParametersService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public state: StateService
  ) {
    iconRegistry.addSvgIcon(
      'error',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg')
    );
    iconRegistry.addSvgIcon(
      'unfold_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/unfold_less.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'remove_circle_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/remove_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'add_circle_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/add_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'unfold_more',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/unfold_more.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'expand_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/expand_less.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_right.svg'
      )
    );
  }

  private setExpandedVariables(rows: any[]) {
    for (let {} of rows) {
      this.rationale.push({ expanded: true });
    }
  }
}
