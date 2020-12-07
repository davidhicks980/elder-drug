import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ParametersService } from 'src/app/parameters.service';
import { StateService } from 'src/app/state.service';
import { MatSelectionList } from '@angular/material/list';
import { LayoutStatus } from '../../state.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'modify-table-panel',
  template: ` <div class="selection-panel">
    <div [fxShow.sm]="layout.sidenavOpen" [fxShow.xs]="true" fxHide>
      <div style="margin-left:2%">
        <h3>Show Tables</h3>
      </div>
      <section>
        <ul [class]="'toggle-group'">
          <li *ngFor="let option of options">
            <mat-checkbox
              class="toggle-button"
              (change)="
                processMobileCheckboxes($event.checked, $event.source.value)
              "
              [value]="option"
              [checked]="initialTables.includes(option)"
            >
              {{ option | caseSplit }}
            </mat-checkbox>
          </li>
        </ul>
      </section>
    </div>

    <div
      class="table-modifier-list"
      [fxHide.sm]="layout.sidenavOpen"
      [fxHide.xs]="true"
      fxShow
    >
      <div class="panel-header">
        <b>Active Tables</b>
      </div>
      <mat-selection-list
        #tableSelectionList
        (ngModelChange)="updateOptions($event)"
        [(ngModel)]="activeTables"
      >
        <div fxFlex fxFlexAlign="center center">
          <mat-list-option
            *ngFor="let option of options"
            [value]="option"
            [selected]="initialTables.includes(option)"
            [disabled]="!initialTables.includes(option)"
          >
            <div class="list-text">{{ option | caseSplit }}</div>
          </mat-list-option>
        </div>
      </mat-selection-list>
    </div>
  </div>`,
  styleUrls: ['./modify-table-panel.component.scss'],
})
export class ModifyTablePanelComponent {
  // Selection list for desktop option list
  @ViewChild('tableSelectionList')
  selectList!: MatSelectionList;
  private tableStore: Map<string, boolean> = new Map();
  public activeTables: string[] = []; // Subject<string[]> = new Subject();
  // Subject<string[]> = new Subject();
  // Tables containing data => to be
  @Input() tablesWithData!: string[];
  public tablesChanged: Subject<Map<string, boolean>> = new Subject();
  public options!: string[];
  layout: LayoutStatus = this.state.layoutStatus;
  public pageLoaded: Subject<boolean> = new Subject();
  private _initialTables: string[] = [];

  public get initialTables() {
    return this._initialTables;
  }

  updateOptions(selections: string[]): void {
    this.state.emitSelectedTables(selections);
  }

  processMobileCheckboxes(checked: boolean, name: string): void {
    this.tableStore.set(name, checked);
    this.tablesChanged.next(this.tableStore);
  }
  processDesktopCheckboxes(names: string[]): void {
    for (const name of names) {
      this.tableStore.set(name, true);
    }
    this.tablesChanged.next(this.tableStore);
  }

  ngAfterViewInit() {
    this._initialTables = this.tablesWithData;
  }
  constructor(
    private parameterService: ParametersService,
    public state: StateService
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
    });
    this.options = this.parameterService.columnDefinitions.map(
      (col) => col.name
    );
    this.tablesChanged.subscribe((store: Map<string, boolean>) => {
      const selectedTables = [] as string[];
      for (const [key, value] of store) {
        if (value) {
          selectedTables.push(key);
        }
      }
      this.state.emitSelectedTables(selectedTables);
    });
  }
}
