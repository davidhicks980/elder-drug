import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { ColumnService } from 'src/app/columns.service';

import { expandButtonAnimation, slideDownAnimation, translateRationaleContent } from '../../animations';
import { FirebaseService } from '../../firebase.service';
import { StateService } from '../../state.service';
import { TableService } from '../../table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./med-table.component.scss'],

  animations: [
    expandButtonAnimation,
    translateRationaleContent,
    slideDownAnimation,
    trigger('rotateChevron', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(-90deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MedTableComponent implements AfterViewInit, OnInit {
  @ViewChild('medTable') table: any;
  // initialize a private variable _data, it's a BehaviorSubject

  @Input() tableName: number;
  @ViewChild(MatSort) sort: MatSort;

  public rows: any[] = [];
  public columnOptions: { field: string; header: string }[];
  public displayedColumns: string[];
  public selectOptions: string[] = [];
  public expandedFields: { field: string; header: string }[];
  public loaded: boolean = false;
  public selectorInitiated: boolean = false;
  expandedElement: any;
  public rationale: { expanded: boolean }[] = [];
  sidenavActive: boolean;
  smallScreen: boolean;
  fields: string[];
  cols: {}[];
  dataSource: MatTableDataSource<[]>;
  enabledTables: number[];
  allData: any;
  tableData: any;
  log(e: Event) {
    console.log(e);
  }
  expandRationale(index: number) {
    this.rationale[index].expanded = !this.rationale[index].expanded;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    const table = this.firebase.groupedTables$.pipe(
      filter((item) => item.id === this.tableName)
    );
    table.subscribe((params) => {
      params.selected.unshift('expand');
      this.fields = params.selected;
      this.dataSource = new MatTableDataSource(params.tables);
      this.expandedFields = params.fields;
    });

    this.loaded = true;
  }
  constructor(
    public parameterService: ColumnService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public firebase: FirebaseService,
    public columnService: ColumnService,
    public tableService: TableService,
    public stateService: StateService
  ) {
    this.firebase = firebase;
    this.columnService = columnService;
    this.tableService.tableStatus$.subscribe((active) => {
      this.enabledTables = active;
    });

    iconRegistry.addSvgIcon(
      'error',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg')
    );
    iconRegistry.addSvgIcon(
      'unfold_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/unfold_less.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'remove_circle_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/remove_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'add_circle_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/add_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'unfold_more',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/unfold_more.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'expand_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/expand_less.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_right.svg'
      )
    );
  }

  private setExpandedVariables(rows: any[]) {
    for (let {} of rows) {
      this.rationale.push({ expanded: true });
    }
  }
}
