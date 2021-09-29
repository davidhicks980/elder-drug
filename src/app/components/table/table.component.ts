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
import stableStringify from 'json-stable-stringify';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ARROW_KEYS } from '../../constants/keys.constants';
import { FilterDirective } from '../../directives/filter.directive';
import { KeyGridDirective } from '../../directives/keygrid.directive';
import { ColumnService } from '../../services/columns.service';
import { destroy } from '../../services/destroy';
import { FilterService } from '../../services/filter.service';
import { GroupByService } from '../../services/group-by.service';
import { KeyGridService } from '../../services/key-grid.service';
import { ResizeService } from '../../services/resize.service';
import { BeersSearchResult, SearchService } from '../../services/search.service';
import { BeersTableDataSource } from './BeersTableDataSource';
import { ExpandingEntry } from './ExpandingEntry';
import { FlatRowGroup } from './RowGroup';
import { TableEntry } from './TableEntry';

@Component({
  selector: 'elder-table',
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
    './table.row.component.scss',
    './header-cell.table.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatSortHeader, { read: ElementRef })
  sortableHeaders: QueryList<ElementRef>;
  @ViewChildren(FilterDirective) headerCells: QueryList<FilterDirective>;
  @ViewChild('elderTable') container: ElementRef;
  @ViewChildren(KeyGridDirective) grid: QueryList<ElementRef>;
  trackBy: (index: number, name: any) => boolean;
  @Input() get filters(): string {
    return this.model.filters;
  }
  set filters(value: string) {
    this.model.filter(value);
  }

  model: BeersTableDataSource<BeersSearchResult>;
  gridCells: KeyGridDirective[];
  FIRST_ROW = 2;
  dataSource: BehaviorSubject<BeersSearchResult[]>;
  destroy$ = new Subject();

  rowCache = new Map();

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
    private searchService: SearchService,
    private resizeService: ResizeService,
    private keyGridService: KeyGridService,
    private changeDetect: ChangeDetectorRef,
    public filterService: FilterService
  ) {
    this.dataSource = new BehaviorSubject([]);
    this.searchService.searchResults$.pipe(destroy(this)).subscribe((result) => {
      this.dataSource.next(result);
    });
    this.model = new BeersTableDataSource(this.dataSource);
    this.columnService.selected$.pipe(destroy(this)).subscribe((selected) => {
      this.model.observeColumnChanges(selected);
    });
    this.model.observeColumnChanges(this.columnService.columnInfo.selected);
    this.groupService.groupedItems$
      .pipe(
        destroy(this),
        map((groups) => {
          return groups.map((group) => group.trim());
        })
      )
      .subscribe((groups) => this.model.updateGroups(groups));
    const cache = new Map();
    this.trackBy = (
      index: number,
      row: TableEntry<BeersSearchResult> | FlatRowGroup<BeersSearchResult>
    ): boolean => {
      let { _position } = row,
        hashTerm = '';
      if ('field' in row) {
        hashTerm = row.field + row.groupHeader;
      } else if ('SearchTerms' in row) {
        hashTerm = row.SearchTerms;
      }
      let hash = stableStringify({ hashTerm, ..._position, expanded: false });
      const match = cache.get(index) === hash;
      cache.set(index, hash);
      return match;
    };
  }
  getRowIndex(row: ExpandingEntry, add = 0) {
    return row._position.index + this.FIRST_ROW + add;
  }

  ngAfterViewInit() {
    this.sort.initialized.pipe(destroy(this)).subscribe(() => {
      this.model.sort = this.sort;
    });
    this.grid.changes.pipe(destroy(this)).subscribe((newCells: QueryList<KeyGridDirective>) => {
      this.gridCells = newCells.toArray();
    });
    this.changeDetect.markForCheck();
  }
}
