import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ARROW_KEYS } from '../../constants/keys.constants';
import { FilterDirective } from '../../directives/filter.directive';
import { KeyGridDirective } from '../../directives/keygrid.directive';
import { ColumnService } from '../../services/columns.service';
import { GroupByService } from '../../services/group-by.service';
import { KeyGridService } from '../../services/key-grid.service';
import { ResizeService } from '../../services/resize.service';
import { BeersSearchResult, SearchService } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { BeersTableDataSource } from './BeersTableDataSource';
import { ExpandingEntry } from './ExpandingEntry';

@Component({
  selector: 'elder-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss', './table.row.component.scss'],

  animations: [
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
  ],
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatSortHeader, { read: ElementRef })
  sortableHeaders: QueryList<ElementRef>;
  @ViewChildren(FilterDirective) headerCells: QueryList<FilterDirective>;
  @ViewChild('elderTable') container: ElementRef;
  @ViewChildren(KeyGridDirective) grid: QueryList<ElementRef>;
  @Input() showFilters: boolean = false;
  model: BeersTableDataSource<BeersSearchResult>;
  selectedRow: any;
  _rowLength: number;
  _columnLength: number;
  gridCells: KeyGridDirective[];
  FIRST_ROW = 2;
  filterCells: Set<KeyGridDirective> = new Set();
  dataSource: BehaviorSubject<BeersSearchResult[]>;

  get mobile$() {
    return this.resizeService.mobileObserver;
  }
  getKeyGridCells(): KeyGridDirective[] {
    let filters = this.headerCells.map(
      (header) => header?.filterRef?.instance?.grid
    ) as KeyGridDirective[];

    const hasFilters = Array.isArray(filters) && filters.length > 0;
    return hasFilters ? [...this.gridCells, ...filters] : this.gridCells;
  }
  handleGridNavigation(event: KeyboardEvent) {
    if (ARROW_KEYS.includes(event.key)) {
      this.keyGridService.handleArrowKeys(event, this.getKeyGridCells());
    }
  }
  constructor(
    private columnService: ColumnService,
    private searchService: SearchService,
    private tableService: TableService,
    private groupService: GroupByService,
    private resizeService: ResizeService,
    private keyGridService: KeyGridService
  ) {
    this.searchService.searchResults$.subscribe((result) => {
      if (!this.dataSource) {
        this.dataSource = new BehaviorSubject(result);
      } else {
        this.dataSource.next(result);
      }
    });
    this.model = new BeersTableDataSource(this.dataSource);
    this.model.observeColumnChanges(this.columnService.selected$);
    this.groupService.groups$
      .pipe(
        map((groups) => {
          return groups.map((group) => group.trim());
        })
      )
      .subscribe((groups) => this.model.updateGroups(groups));

    this.tableService.tableFilter$.subscribe(({ column, term }) => {
      return this.model.filter(column, term);
    });
  }
  getRowIndex(row: ExpandingEntry, add = 0) {
    return row._position.index + this.FIRST_ROW + add;
  }

  ngAfterViewInit() {
    this.sort.initialized.subscribe(() => {
      this.model.sort = this.sort;
    });
    this.grid.changes.subscribe((newCells: QueryList<KeyGridDirective>) => {
      this.gridCells = newCells.toArray();
    });
  }
}
