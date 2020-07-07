import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  ParametersService,
  columnDefinition,
} from 'src/app/parameters.service';
import {
  Breakpoints,
  BreakpointState,
  BreakpointObserver,
} from '@angular/cdk/layout';

@Component({
  selector: 'modify-table-panel',
  template: ` <div class="padding">
    <div *ngIf="smallScreen">
      <div>
        <h3>Show Tables</h3>
      </div>
      <mat-button-toggle-group
        (change)="updateOptions($event.value)"
        [value]="activeTables"
        multiple
        class="toggle-group"
      >
        <mat-button-toggle
          class="toggle-button"
          *ngFor="let option of options"
          [checked]="isTableActive(option.name)"
          [value]="option.name"
          [disabled]="!isTableActive(option.name)"
        >
          {{ option.name | caseSplit }}
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <div class="table-modifier-list" *ngIf="!smallScreen">
      <div class="panel-header">
        <p>Show Tables</p>
      </div>
      <mat-selection-list
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
export class ModifyTablePanelComponent implements OnChanges, OnInit {
  activeTables: string[] = ['full', 'disease'];
  public selectedOptions: string[];
  public message: string;
  options: columnDefinition[];
  smallScreen: boolean;
  @Input() tablesWithData: string[];
  @Output() sendActiveTables: EventEmitter<string[]> = new EventEmitter();

  updateOptions(selections) {
    this.sendActiveTables.emit(selections);
  }
  ngOnInit() {
    this.options = this.parameterService.columnDefinitions;
    this.updateOptions(this.isTableActive);
  }

  isTableActive(table) {
    try {
      return this.tablesWithData.includes(table);
    } catch (err) {
      null;
    }
  }

  ngOnChanges() {
    this.sendActiveTables.emit(this.activeTables);
  }
  public constructor(
    public parameterService: ParametersService,
    public breakpointObserver: BreakpointObserver
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
  }
}
