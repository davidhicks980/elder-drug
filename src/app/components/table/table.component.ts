import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    return this.resizeService.mobile$;
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
    private groupService: GroupByService,
    private tableService: TableService,
    private searchService: SearchService,
    private resizeService: ResizeService,
    private keyGridService: KeyGridService,
    private changeDetect: ChangeDetectorRef
  ) {
    this.dataSource = new BehaviorSubject([]);
    this.searchService.searchResults$.subscribe((result) => {
      this.dataSource.next(result);
    });
    this.model = new BeersTableDataSource(this.dataSource);
    this.columnService.selected$.subscribe((selected) => {
      this.model.observeColumnChanges(selected);
    });
    this.model.observeColumnChanges(this.columnService.columnInfo.selected);
    this.groupService.groupedItems$
      .pipe(
        map((groups) => {
          return groups.map((group) => group.trim());
        })
      )
      .subscribe((groups) => this.model.updateGroups(groups));

    this.tableService.tableFilter$.subscribe(({ column, term }) => {
      this.model.filter(column, term);
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
    this.changeDetect.markForCheck();
  }
}
