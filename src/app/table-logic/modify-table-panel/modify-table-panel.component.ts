import { Component, OnInit } from '@angular/core';
import {
  ParametersService,
  columnDefinition,
} from 'src/app/parameters.service';

@Component({
  selector: 'app-modify-table-panel',
  template: ` <div class="padding">
    <div class="table-modifier-list">
      <div class="panel-header">
        <p>Show Tables</p>
      </div>
      <mat-selection-list
        (click)="updateOptions(activeTables)"
        [(ngModel)]="activeTables"
      >
        <div fxFlex fxFlexAlign="center center">
          <mat-list-option
            *ngFor="let option of options"
            [value]="option.name"
            selected
          >
            <div class="list-text">{{ option.name }}</div>
          </mat-list-option>
        </div>
      </mat-selection-list>
    </div>
  </div>`,
  styleUrls: ['./modify-table-panel.component.scss'],
})
export class ModifyTablePanelComponent {
  activeTables: string[] = ['full', 'disease'];
  public selectedOptions: string[];
  public message: string;
  options: columnDefinition[];

  updateOptions(selectedOptions) {
    let output = [];
    this.options = this.parameterService.columnDefinitions;
    for (let obj of this.options) {
      if (selectedOptions.includes(obj.name)) {
        obj.active = true;
        output.push(obj);
      } else {
        obj.active = false;
      }
    }
    this.parameterService.sendOptions(output);
  }

  public constructor(public parameterService: ParametersService) {
    this.options = this.parameterService.columnDefinitions;
    parameterService.recieveTables$.subscribe((options: columnDefinition[]) => {
      options.forEach((option) => {
        this.activeTables.push(option.description);
      });
    });
  }
}
