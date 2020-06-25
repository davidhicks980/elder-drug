import { Component, OnInit, TrackByFunction } from '@angular/core';
import { WebsocketService, BeersEntry } from '../websocket.service';
import { MatTableDataSource } from '@angular/material/table';
import { ParametersService, columnDefinition } from '../parameters.service';
import {
  Breakpoints,
  BreakpointState,
  BreakpointObserver,
} from '@angular/cdk/layout';
@Component({
  selector: 'app-table-logic',
  template: `
    <div fxLayoutAlign="center none">
      <div class="main-content-box gray-big-logo"></div>
      <div
        class="main-content-box"
        fxFlex
        fxFlexOffset="10px"
        [fxLayout]="smallScreen ? 'column' : 'row'"
        fxLayoutAlign="smallScreen ? 'start center' : 'center start'"
      >
        <div
          fxFlex
          [fxFlexOrder]="smallScreen === true ? '2' : '1'"
          fxLayout="column"
        >
          <div
            #expansionPanel
            *ngFor="let table of tables | keyvalue; trackBy: trackByFn"
          >
            <app-med-table
              *ngIf="isTableActive(activeTables, table.key)"
              [tableData]="table"
            >
            </app-med-table>
            <br />
          </div>
        </div>
        <div
          #modifyPanel
          fxFlex
          [fxFlexOrder]="smallScreen === true ? '1' : '2'"
        >
          <modify-table-panel
            [hidden]="!active"
            [tablesWithData]="tablesWithData"
            (sendActiveTables)="setActiveTables($event)"
          ></modify-table-panel>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./table-logic.component.scss'],
})
export class TableLogicComponent implements OnInit {
  data: any;
  active: boolean = false;
  tablesWithData: string[];
  tables: Table[];
  activeTables: string[];
  smallScreen: boolean;
  trackByFn: TrackByFunction<any> = (_, item) => item.id;
  ngOnInit() {
    let columnFilter: (data: BeersEntry, filter: string) => boolean = function (
      data: BeersEntry,
      filter: string
    ): boolean {
      if (data[filter]) return true;
    };
    //Handles websocket data --> connects to main database to provide Beers info
    this.webSocketService
      .listen('search-results')
      .subscribe((tables: Table[]) => {
        this.active = true;
        this.tables = tables;
        this.tablesWithData = this.parameterService.filterInactiveTables(
          this.tables
        );
      });
  }

  public isTableActive(activeList: string[], table: string) {
    return activeList.includes(table);
  }

  setActiveTables(tables) {
    this.activeTables = tables;
  }

  constructor(
    public webSocketService: WebsocketService,
    private parameterService: ParametersService,
    private breakpointObserver: BreakpointObserver
  ) {
    {
      this.breakpointObserver
        .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
        .subscribe((state: BreakpointState) => {
          if (state.matches) {
            this.smallScreen = true;
          } else {
            this.smallScreen = false;
          }
        });
    }
  }
}

export interface Columns {
  EntryID: number;
  DiseaseState: string;
  Category: number;
  TableDefinition: string;
  Item: string;
  MinimumClearance: number;
  MaximumClearance: number;
  DrugInteraction: string;
  Inclusion: string;
  Exclusion: string;
  Rationale: string;
  Recommendation: string;
  RecommendationLineTwo: string;
  ItemType: string;
  ShortTableName: string;
  SearchTerm: string;
}
export interface Table {
  [key: string]: any;
}
