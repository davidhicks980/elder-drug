import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { StateService } from 'src/app/state.service';

import { ColumnService } from '../../columns.service';
import { LayoutStatus } from '../../state.service';
import { TableService } from '../../table.service';

@Component({
  selector: 'modify-table-panel',
  template: ` <form [formGroup]="tableOptions">
    <div
      class="panel-container"
      [class.small-screen]="this.state.smallContent$ | async"
    >
      <h3 style="margin: 0 0 0 10px"><b>Show Tables</b></h3>

      <ul
        [class.small-screen]="this.state.smallContent$ | async"
        formArrayName="optionControls"
      >
        <li *ngFor="let option of formOptions.controls; let i = index">
          <label
            [style.direction]="
              (this.state.smallContent$ | async) ? 'rtl' : 'ltr'
            "
            [for]="'checkbox_' + i"
            class="checkbox"
          >
            <span class="checkbox-label">{{ options[i].description }}</span>

            <span class="checkbox-input">
              <input
                matRipple
                [id]="'checkbox_' + i"
                [formControlName]="i"
                checked="checked"
                type="checkbox"
                name="checkbox"
              />
              <span class="checkbox-control">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    d="M1.73 12.91l6.37 6.37L22.79 4.59"
                  />
                </svg>
              </span>
            </span>
          </label>
        </li>
      </ul>
    </div>
  </form>`,
  styleUrls: ['./modify-table-panel.component.scss'],
})
export class ModifyTablePanelComponent implements AfterViewInit {
  // Selection list for desktop option list
  @ViewChild('tableSelectionList')
  selectList!: MatSelectionList;
  public activeTables: string[] = []; // Subject<string[]> = new Subject();
  public options!: { id: number; description: string }[];
  layout: LayoutStatus = this.state.layoutStatus;

  public tableOptions: FormGroup = this.fb.group({
    optionControls: this.fb.array([]),
  });
  enabledTables: number[];
  loaded: boolean;
  checkboxOrder: Map<number, number> = new Map();
  contentIsSmall: boolean;

  get formOptions(): FormArray {
    return this.tableOptions.get('optionControls') as FormArray;
  }
  addTable(disabled: boolean, value: number) {
    let i = this.formOptions.length;
    this.formOptions.insert(
      i,
      this.fb.control({ value: !disabled, disabled: disabled })
    );
    this.checkboxOrder.set(i, value);
  }
  ngAfterViewInit() {
    this.loaded = true;
  }
  constructor(
    private tableService: TableService,
    public state: StateService,
    public fb: FormBuilder,
    public columnService: ColumnService
  ) {
    state.smallContent$.subscribe((i) => console.log(i));
    this.options = columnService.columnDefinitions.map((col) => {
      return { id: col.id, description: col.description };
    });
    this.tableService.tableStatus$.subscribe((tables: number[]) => {
      this.enabledTables = tables;
    });
    for (let option of this.options) {
      this.enabledTables.includes(option.id)
        ? this.addTable(false, option.id)
        : this.addTable(true, option.id);
    }

    this.formOptions.valueChanges.subscribe((tables: boolean[]) => {
      this.tableService.emitSelectedTables(
        this.find(true, tables).map((item) => this.checkboxOrder.get(item))
      );
    });
  }
  find(needle: boolean, haystack: boolean[]) {
    const results = [];
    let idx = haystack.indexOf(needle);
    while (idx != -1) {
      results.push(idx);
      idx = haystack.indexOf(needle, idx + 1);
    }
    return results;
  }
}
