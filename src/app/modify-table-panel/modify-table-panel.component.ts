import { Component, Output, AfterViewInit } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modify-table-panel',
  template: ` <div class="tableModifierList">
    <mat-selection-list
      (click)="updateListener()"
      [(ngModel)]="selectedOptions"
    >
      <div fxFlex fxFlexAlign="center center">
        <h3 class="panel-header">
          Show Tables
        </h3>
        <mat-divider></mat-divider>
        <mat-list-option *ngFor="let option of options" [value]="option.value">
          <div class="list-text">{{ option.name }}</div>
        </mat-list-option>
      </div>
    </mat-selection-list>
  </div>`,
  styleUrls: ['./modify-table-panel.component.scss'],
})
export class ModifyTablePanelComponent implements AfterViewInit {
  options = [
    { name: 'General Info', value: 'full' },
    { name: 'Disease-Specific', value: 'disease' },
    { name: 'Drug Interactions', value: 'interactions' },
    { name: 'Clearance Ranges', value: 'clearance' },
  ];
  public selectedOptions: string[];
  @Output() emitTables = new EventEmitter<any>();
  public message: string;

  updateListener() {
    this.emitTables.emit(this.selectedOptions);
  }
  ngAfterViewInit() {
    this.emitTables.emit(this.selectedOptions);
  }

  public constructor() {}
}
