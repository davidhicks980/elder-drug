import { Component, OnInit } from '@angular/core';
import { WebsocketService, BeersEntry } from '../websocket.service';
import { MatTableDataSource } from '@angular/material/table';
import { ParametersService, columnDefinition } from '../parameters.service';
@Component({
  selector: 'app-table-logic',
  template: `
    <div class="main-content-box gray-big-logo">
      <app-big-logo *ngIf="!active"></app-big-logo>
    </div>
    <div class="main-content-box" fxLayout="row" fxLayoutAlign="center">
      <div fxLayout="column">
        <div #expansionPanel *ngFor="let table of activeTables">
          <app-med-table
            [ngStyle]="
              table.active === true ? { display: '' } : { display: 'none' }
            "
            [dataSource]="dataSource"
            [description]="table.description"
            [name]="table.name"
            [filters]="table.filters"
          >
          </app-med-table>
          <br />
        </div>
      </div>
      <div #modifyPanel>
        <app-modify-table-panel></app-modify-table-panel>
      </div>
    </div>
  `,
  styleUrls: ['./table-logic.component.scss'],
})
export class TableLogicComponent implements OnInit {
  data: any;
  active: boolean = false;
  emptyTables: string[];
  activeTables: columnDefinition[];

  dataSource: MatTableDataSource<BeersEntry>;

  sort: any;

  ngOnInit() {
    let columnFilter: (data: BeersEntry, filter: string) => boolean = function (
      data: BeersEntry,
      filter: string
    ): boolean {
      if (data[filter]) return true;
    };
    //Handles websocket data --> connects to main database to provide Beers info
    this.webSocketService.listen('search-results').subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = columnFilter;
    });
  }

  constructor(
    public webSocketService: WebsocketService,
    private parameterService: ParametersService
  ) {
    this.parameterService.recieveOptions$.subscribe(
      (options: columnDefinition[]) => {
        this.activeTables = options;
      }
    );
  }
}
