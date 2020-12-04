import { Component, ViewChild, Input, OnChanges, OnInit } from '@angular/core';

import { Table } from 'primeng/table';

import { ParametersService } from 'src/app/parameters.service';
import { slideDownAnimation, fadeInAnimation } from '../../animations';
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
    fadeInAnimation,
  ],
})
export class MedTableComponent implements OnChanges, OnInit {
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

  changeActiveColumns(cols: string[]) {
    this.columnOptions = this.parameterService.lookupColumns(cols);
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
