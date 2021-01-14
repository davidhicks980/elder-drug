import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { ColumnService } from 'src/app/columns.service';

import { slideDownAnimation } from '../../animations';
import { FirebaseService } from '../../firebase.service';
import { StateService } from '../../state.service';
import { TableService } from '../../table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./med-table.component.scss'],

  animations: [
    trigger('expandButton', [
      state('default', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('rotated => default', animate('400ms ease-out')),
      transition('default => rotated', animate('400ms ease-in')),
    ]),
    slideDownAnimation,
    trigger('rotateChevron', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(-90deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('translateRationale', [
      state('expanded', style({ transform: 'translateY(0)' })),
      state('closed', style({ transform: 'translateY(-200px)' })),
      transition(
        'closed<=>expanded',
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),

      transition(
        'expanded<=>closed',
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')
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
  fields: string[];
  cols: {}[];
  dataSource: MatTableDataSource<[]> = new MatTableDataSource();
  enabledTables: number[];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  moveSearchTerms(arr: string[], item: string) {
    var index = arr.indexOf(item);
    arr.splice(index, 1);
    arr.unshift(item);
  }
  ngOnInit() {
    const table = this.firebase.groupedTables$.pipe(
      filter((item) => item.id === this.tableName)
    );

    table.subscribe((params) => {
      this.fields = params.selected;
      this.dataSource.data = params.tables;
      this.expandedFields = params.fields;
      this.moveSearchTerms(this.fields, 'SearchTerm');
    });

    this.loaded = true;
  }
  constructor(
    public parameterService: ColumnService,
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
  }
}
