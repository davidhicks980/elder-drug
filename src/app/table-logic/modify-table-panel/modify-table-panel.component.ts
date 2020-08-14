import { Component, Input, ViewChild, OnInit } from '@angular/core';
import {
  ParametersService,
  columnDefinition,
} from 'src/app/parameters.service';
import {
  Breakpoints,
  BreakpointState,
  BreakpointObserver,
} from '@angular/cdk/layout';
import { StateService } from 'src/app/state.service';
import { MatSelectionList } from '@angular/material/list';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'modify-table-panel',
  template: ` <div class="padding">
    <div *ngIf="smallScreen || xSmallScreen">
      <div>
        <h3>Show Tables</h3>
      </div>
      <mat-button-toggle-group
        #tableToggleGroup="matButtonToggleGroup"
        (change)="updateOptions($event.value)"
        multiple
        [class]="xSmallScreen ? 'toggle-group' : ''"
      >
        <mat-button-toggle
          class="toggle-button"
          *ngFor="let option of options"
          [checked]="isTableActive(option.name)"
          [disabled]="!isTableActive(option.name)"
          [value]="option.name"
        >
          {{ option.name | caseSplit }}
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <div class="table-modifier-list" *ngIf="!smallScreen && !xSmallScreen">
      <div class="panel-header">
        <p>Show Tables</p>
      </div>
      <mat-selection-list
        #tableSelectionList
        (ngModelChange)="updateOptions($event)"
        [ngModel]="activeTables"
      >
        <div fxFlex fxFlexAlign="center center">
          <mat-list-option
            *ngFor="let option of options"
            [value]="option.name"
            [selected]="isTableActive(option.name)"
            [disabled]="!isTableActive(option.name)"
          >
            <div class="list-text">{{ option.name | caseSplit }}</div>
          </mat-list-option>
        </div>
      </mat-selection-list>
    </div>
  </div>`,
  styleUrls: ['./modify-table-panel.component.scss'],
})
export class ModifyTablePanelComponent implements OnInit {
  @ViewChild('tableSelectionList') selectList: MatSelectionList;
  @ViewChild('tableToggleGroup') toggleGroup: MatButtonToggleGroup;
  activeTables: string[] = ['full', 'disease'];
  public selectedOptions: string[];
  public message: string;
  options: columnDefinition[];
  smallScreen: boolean;
  @Input() tablesWithData: string[];
  xSmallScreen: boolean;

  updateOptions(selections) {
    this.stateService.emitSelectedTables(selections);
  }

  ngOnInit() {
    this.options = this.parameterService.columnDefinitions;
  }

  isTableActive(table) {
    try {
      return this.tablesWithData.includes(table);
    } catch (err) {
      null;
    }
  }

  public constructor(
    public parameterService: ParametersService,
    public breakpointObserver: BreakpointObserver,
    public stateService: StateService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = true;
        } else {
          this.smallScreen = false;
        }
      });

    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.xSmallScreen = true;
        } else {
          this.xSmallScreen = false;
        }
      });
  }
}
