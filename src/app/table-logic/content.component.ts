import { Component, TrackByFunction, Input } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ParametersService } from '../parameters.service';
import { StateService, ScreenWidth } from '../state.service';
import { fadeInAnimation } from '../animations';
@Component({
  selector: 'app-content',
  template: `
    <div fxLayoutAlign="center none" class="content-container">
      <div @fadeIn class="main-content-box gray-big-logo" *ngIf="!loaded">
        <app-logo [altColor]="true" [contentPlaceholder]="true"></app-logo>
      </div>
      <div
        [hidden]="loaded"
        class="main-content-box"
        fxFlexOffset="10px"
        [fxLayout]="state.fullScreenSearch ? 'column' : 'row'"
      >
        <div
          [fxFlexOrder]="state.fullScreenSearch ? '2' : '1'"
          fxLayout="column"
        >
          <div
            #expansionPanel
            *ngFor="let table of tables | keyvalue; trackBy: trackByFn"
          >
            <app-med-table
              *ngIf="this.activeTables.includes(table.key)"
              [tableData]="table"
            >
            </app-med-table>
            <div class="table-spacer"></div>
          </div>
        </div>
        <div
          #modifyPanel
          [fxFlexOrder]="state.fullScreenSearch ? '1' : '2'"
          class="panel-width"
        >
          <modify-table-panel
            *ngIf="loaded"
            [tablesWithData]="tablesWithData"
          ></modify-table-panel>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./content.component.scss'],
  animations: [fadeInAnimation],
})
export class ContentComponent {

  constructor(
    public firestore: WebsocketService,
    private parameterService: ParametersService,
    public state: StateService
  ) {
    firestore.groupedTables.subscribe((items) => {
      this.tables = items;
      this.tablesWithData = this.parameterService.filterActiveTables(items);
    });
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
    this.state.tableStatus$.subscribe((active) => {
      this.activeTables = active;

    });
  }
  data: any;
  active = false;
  tablesWithData: string[];
  tables: Table[];
  activeTables: string[] = ['GeneralInfo'];
  screenSize: ScreenWidth;
  loaded: boolean;
  trackByFn: TrackByFunction<any> = (_, item) => item.id;
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
