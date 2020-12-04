import {
  Component,
  TrackByFunction,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ParametersService } from '../parameters.service';
import { StateService, ScreenStatus, LayoutStatus } from '../state.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-content',
  template: `
    <div
      [class]="
        layout.sidenavOpen ? 'sidenav-open content' : 'sidenav-closed content'
      "
    >
      <div
        *ngIf="loaded"
        class="main-content-box"
        fxLayout="row"
        [fxLayout.sm]="layout.sidenavOpen ? 'column' : 'row'"
        fxLayout.xs="column"
        [@fadeIn]="loaded"
      >
        <div
          [fxFlexOrder.sm]="layout.sidenavOpen ? '2' : '1'"
          fxFlexOrder.xs="2"
          fxFlexOrder="1"
          fxShrink="0"
        >
          <div
            *ngFor="let table of tables | keyvalue; trackBy: trackByFn"
            [class]="
              layout.sidenavOpen
                ? 'sidenav-open tables'
                : 'sidenav-closed tables'
            "
          >
            <app-med-table
              *ngIf="activeTables.includes(table.key)"
              [tableData]="table"
            >
            </app-med-table>
            <div class="table-spacer"></div>
          </div>
          <br />
        </div>
        <div
          #modifyPanel
          [fxFlexOrder.sm]="layout.sidenavOpen ? '1' : '2'"
          fxFlexOrder.xs="1"
          fxFlexOrder="2"
        >
          <modify-table-panel
            [hidden]="!loaded"
            [tablesWithData]="loaded ? activeTables : null"
          ></modify-table-panel>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('2s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ContentComponent {
  sidenavActive: boolean;
  contentIsMobileWidth: boolean;
  layout: LayoutStatus;
  constructor(
    public firestore: WebsocketService,
    private parameterService: ParametersService,
    public state: StateService,
    public widthObserver: BreakpointObserver
  ) {
    firestore.groupedTables.subscribe((items) => {
      this.tables = items;
      this.tablesWithData = this.parameterService.filterActiveTables(items);
      this.loaded = true;
      this.activeTables = this.tablesWithData;
      this.tablesLoaded.emit(true);
    });
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus) => {
      this.layout = layoutStatus;
    });
    this.state.tableStatus$.subscribe((active) => {
      this.activeTables = active;
    });
  }

  data: any;
  active = false;
  tablesWithData: string[] = [];
  tables: Table[];
  activeTables: string[];
  loaded: boolean;
  trackByFn: TrackByFunction<any> = (_, item) => item.id;
  @Output() tablesLoaded: EventEmitter<boolean> = new EventEmitter();

  // Create observer object
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
