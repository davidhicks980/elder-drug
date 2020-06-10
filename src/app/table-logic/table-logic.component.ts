import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { WebsocketService, BeersEntry } from '../websocket.service';
import { MatTableDataSource } from '@angular/material/table';
import { ParametersService, TableParameters } from '../parameters.service';
@Component({
  selector: 'app-table-logic',
  template: ` <div
    fxLayout
    fxLayout.xs="row"
    fxLayoutGap="10px"
    fxLayoutGap.xs="0"
  >
    <div fxFlex>
      <div class="table-padding" *ngFor="let param of activeTableParameters">
        <div>
          <app-med-table
            [class]="tables.includes(param.name) ? 'show' : 'hide'"
            [data]="param.data"
            [displayedColumns]="param.columnOptions"
            [selectedColumns]="param.selectedColumns"
            [name]="param.name"
            [toggleOptions]="param.toggleOptions"
          >
          </app-med-table>
        </div>
        <br />
      </div>
    </div>
    <div style="width: 200px;" fxFlexOrder="2">
      <app-modify-table-panel
        (emitTables)="drawTables($event)"
      ></app-modify-table-panel>
    </div>
  </div>`,
  styleUrls: ['./table-logic.component.scss'],
})
export class TableLogicComponent implements AfterViewInit {
  activeTableParameters: TableParameters[] = [
    {
      name: 'disease',
      columnOptions: null,
      selectedColumns: null,
      filters: null,
      data: null,
    },
    {
      name: 'clearance',
      columnOptions: null,
      selectedColumns: null,
      filters: null,
      data: null,
    },
    {
      name: 'interactions',
      columnOptions: null,
      selectedColumns: null,
      filters: null,
      data: null,
    },
    {
      name: 'full',
      columnOptions: null,
      selectedColumns: null,
      filters: null,
      data: null,
    },
  ];
  data: any;
  getVal(val) {
    console.log(val);
  }
  tables: string[] = [];
  public constructor(
    public webSocketService: WebsocketService,
    private parametersService: ParametersService
  ) {}

  drawTables(tables) {
    this.tables = tables;
    let outArray = [];
    this.activeTableParameters = this.parametersService.getTableInfo(tables);
    try {
      for (let param of this.activeTableParameters) {
        param.data = this.parametersService.mapData(this.data, param.filters);
      }
    } catch (err) {
      null;
    }
  }

  ngAfterViewInit() {
    //Handles websocket data --> connects to main database to provide Beers info

    this.webSocketService.listen('search-results').subscribe((data: any[]) => {
      let mappedData = this.webSocketService.mapData(data);
      this.data = mappedData;
    });
  }
}
