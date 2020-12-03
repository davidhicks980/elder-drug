import {
  Component,
  TrackByFunction,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ParametersService } from '../parameters.service';
import { StateService, ScreenWidth } from '../state.service';
import {
  fadeInAnimation,
  tableVisibleAnimation,
  contentAnimation,
} from '../animations';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-content',
  template: `
    <div
      [class]="
        sidenavActive ? 'sidenav-open content' : 'sidenav-closed content'
      "
    >
      <div
        [hidden]="loaded"
        class="main-content-box"
        fxLayout="row"
        [fxLayout.sm]="sidenavActive ? 'column' : 'row'"
        fxLayout.xs="column"
      >
        <div
          [fxFlexOrder.sm]="sidenavActive ? '2' : '1'"
          fxFlexOrder.xs="2"
          fxFlexOrder="1"
          fxShrink="0"
        >
          <div
            *ngFor="let table of tables | keyvalue; trackBy: trackByFn"
            [class]="
              sidenavActive ? 'sidenav-open tables' : 'sidenav-closed tables'
            "
          >
            <app-med-table
              *ngIf="this.activeTables.includes(table.key)"
              [tableData]="table"
            >
            </app-med-table>
            <div class="table-spacer"></div>
          </div>
          <br />
        </div>
        <div
          #modifyPanel
          [fxFlexOrder.sm]="sidenavActive ? '1' : '2'"
          fxFlexOrder.xs="1"
          fxFlexOrder="2"
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
  animations: [fadeInAnimation, tableVisibleAnimation, contentAnimation],
})
export class ContentComponent {
  sidenavActive: boolean;
  smallScreen: boolean;
  constructor(
    public firestore: WebsocketService,
    private parameterService: ParametersService,
    public state: StateService,
    public widthObserver: BreakpointObserver
  ) {
    firestore.groupedTables.subscribe((items) => {
      this.tables = items;
      this.tablesWithData = this.parameterService.filterActiveTables(items);

      this.activeTables = this.tablesWithData;
      this.loaded = true;
      this.tablesLoaded.emit(true);
    });
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      if (
        (this.sidenavActive && screenSize === 'SMALL') ||
        screenSize === 'XSMALL'
      ) {
        this.smallScreen = true;
      } else {
        this.smallScreen = false;
      }
    });
    this.state.tableStatus$.subscribe((active) => {
      this.activeTables = active;
    });
    this.state.sidenavStatus$.subscribe((sidenavOpen) => {
      this.smallScreen = sidenavOpen
        ? this.widthObserver.isMatched('(max-width: 959.59px)')
        : this.widthObserver.isMatched('(max-width: 599px)');

      this.sidenavActive = sidenavOpen;
    });
  }

  data: any;
  active = false;
  tablesWithData: string[];
  tables: Table[];
  activeTables: string[];
  loaded: boolean;
  trackByFn: TrackByFunction<any> = (_, item) => item.id;
  @Output() tablesLoaded: EventEmitter<boolean> = new EventEmitter();
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
