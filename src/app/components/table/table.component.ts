import { CdkTable } from '@angular/cdk/table';
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
import { BehaviorSubject, Subject } from 'rxjs';

import { ARROW_KEYS } from '../../constants/keys.constants';
import { KeyGridDirective } from '../../directives/keygrid.directive';
import { ColumnService } from '../../services/columns.service';
import { destroy } from '../../services/destroy';
import { FilterService } from '../../services/filter.service';
import { GroupByService } from '../../services/group-by.service';
import { KeyGridService } from '../../services/key-grid.service';
import { LayoutService } from '../../services/layout.service';
import { BeersSearchResult } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { BeersTableDataSource } from './BeersTableDataSource';
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
  @ViewChild('elderTable') container: ElementRef;
  @ViewChildren(KeyGridDirective) grid: QueryList<ElementRef>;
  @ViewChild(CdkTable) table: CdkTable<BeersSearchResult>;
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
  loading = new BehaviorSubject(false);
  rowCache = new Map();

  get mobile$() {
    return this.resizeService.mobile$;
  }

  handleGridNavigation(event: KeyboardEvent) {
    if (ARROW_KEYS.includes(event.key)) {
      this.keyGridService.handleArrowKeys(event, this.gridCells);
    }
  }
  rowShown(model: BeersTableDataSource<unknown>) {
    return function (index: number, row: TableEntry<unknown> | FlatRowGroup<unknown>) {
      return model.checkIsRowShown(row);
    };
  }
  getPadding(row: TableEntry<BeersSearchResult> | FlatRowGroup<BeersSearchResult>) {
    return (row.position.id.match(/:/g) ?? []).length;
  }
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService,
    private keyGridService: KeyGridService,
    private changeDetect: ChangeDetectorRef,
    public resizeService: LayoutService,
    public filterService: FilterService
  ) {
    this.model = new BeersTableDataSource();
    this.tableService.entries$.pipe(destroy(this)).subscribe((result) => {
      this.model.updateData(result);
    });
    this.columnService.selected$.pipe(destroy(this)).subscribe((selected) => {
      this.model.updateColumns(selected);
    });
    this.groupService.groupedItems$.subscribe((groups) => {
      this.model.updateGroups(groups);
      this.changeDetect.markForCheck();
    });

    this.trackBy = this.getTrackByClosure();
  }

  getTrackByClosure() {
    const cache = new Map();
    return (
      index: number,
      row: TableEntry<BeersSearchResult> | FlatRowGroup<BeersSearchResult>
    ): boolean => {
      const match = cache.get(index) === row.position.hash;
      cache.set(index, row.position.hash);
      return match;
    };
  }

  ngAfterViewInit() {
    this.sort.initialized.pipe(destroy(this)).subscribe(() => {
      this.model.sort = this.sort;
    });
    this.grid.changes.pipe(destroy(this)).subscribe((newCells: QueryList<KeyGridDirective>) => {
      this.gridCells = newCells.toArray();
    });
    const results = this.tableService.entries;
    const columns = this.columnService.selected;
    const groups = this.groupService.groups;
    console.log(results);
    this.model.updateData(results);
    this.model.updateColumns(columns);
    this.model.updateGroups(groups);
    this.changeDetect.markForCheck();
  }
}
