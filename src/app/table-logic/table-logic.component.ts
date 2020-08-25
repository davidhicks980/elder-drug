import { Component, OnInit, TrackByFunction } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ParametersService } from '../parameters.service';
import {
  Breakpoints,
  BreakpointState,
  BreakpointObserver,
} from '@angular/cdk/layout';
import { StateService } from '../state.service';
@Component({
  selector: 'app-table-logic',
  template: `
    <div fxLayoutAlign="center none">
      <div [hidden]="active" class="main-content-box gray-big-logo">
        <app-big-logo></app-big-logo>
      </div>
      <div
        class="main-content-box"
        fxFlexOffset="10px"
        [fxLayout]="smallScreen ? 'column' : 'row'"
        [fxLayoutAlign]="smallScreen ? 'start center' : 'center start'"
      >
        <div [fxFlexOrder]="smallScreen === true ? '2' : '1'" fxLayout="column">
          <div
            #expansionPanel
            *ngFor="let table of tables | keyvalue; trackBy: trackByFn"
          >
            <app-med-table
              *ngIf="isTableActive(activeTables, table.key)"
              [tableData]="table"
            >
            </app-med-table>
            <div class="table-spacer"></div>
          </div>
        </div>
        <div
          #modifyPanel
          [fxFlex]="xSmallScreen ? 40 : 20"
          [fxFlexOrder]="smallScreen === true ? '1' : '2'"
          class="panel-width"
        >
          <modify-table-panel
            [hidden]="!active"
            [tablesWithData]="tablesWithData"
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
  activeTables: string[] = ['GeneralInfo'];
  smallScreen: boolean;
  trackByFn: TrackByFunction<any> = (_, item) => item.id;
  xSmallScreen: boolean;
  ngOnInit() {
    //Handles websocket data --> connects to main database to provide Beers info
  }

  public isTableActive(activeList: string[], table: string) {
    return activeList.includes(table);
  }

  constructor(
    public webSocketService: WebsocketService,
    private parameterService: ParametersService,
    private breakpointObserver: BreakpointObserver,
    private stateService: StateService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
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
    this.stateService.tableStatus$.subscribe((active) => {
      this.activeTables = active;
      console.log(this.activeTables);
    });
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
