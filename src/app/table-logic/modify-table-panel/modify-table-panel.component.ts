import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ParametersService } from 'src/app/parameters.service';
import { StateService } from 'src/app/state.service';
import { MatSelectionList } from '@angular/material/list';
import { ScreenWidth } from '../../state.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'modify-table-panel',
  template: ` <div class="selection-panel">
    <div *ngIf="state.fullScreenSearch">
      <div>
        <h3>Show Tables</h3>
      </div>
      <section>
        <ul [class]="'toggle-group'">
          <li *ngFor="let option of options">
            <mat-checkbox
              class="toggle-button"
              [disabled]="!this.tablesWithData.includes(option)"
              (change)="
                processMobileCheckboxes($event.checked, $event.source.value)
              "
              [value]="option"
              [checked]="this.tablesWithData.includes(option)"
            >
              {{ option | caseSplit }}
            </mat-checkbox>
          </li>
        </ul>
      </section>
    </div>

    <div class="table-modifier-list" *ngIf="!state.fullScreenSearch">
      <div class="panel-header">
        <p>Show Tables</p>
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
            [selected]="this.tablesWithData.includes(option)"
            [disabled]="!this.tablesWithData.includes(option)"
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
  @ViewChild('tableSelectionList') selectList: MatSelectionList;
  private tableStore: Map<string, boolean> = new Map();
  public activeTables: string[]; // Subject<string[]> = new Subject();
  // Tables containing data => to be
  @Input() tablesWithData: string[];
  public tablesChanged: Subject<Map<string, boolean>> = new Subject();
  public selectedOptions: string[];
  public message: string;
  public options: string[];
  public screenSize: ScreenWidth;

  updateOptions(selections: string[]): void {
    this.state.emitSelectedTables(selections);
  }

  isTableActive(table: string): boolean {
    try {
      return this.tablesWithData.includes(table);
    } catch (err) {
      null;
    }
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

  constructor(
    private parameterService: ParametersService,
    public state: StateService
  ) {
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
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
