import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Keys } from '../../constants/keys.constants';
import { KeyGridDirective } from '../../directives/keygrid.directive';
import { ColumnService } from '../../services/columns.service';
import { destroy } from '../../functions/destroy';
import { FilterService } from '../../services/filter.service';
import { GroupByService } from '../../services/group-by.service';
import { KeyGridService } from '../../services/key-grid.service';
import { LayoutService } from '../../services/layout.service';
import { ElementMediaQuery, ResizerService } from '../../services/resizer.service';
import { BeersSearchResult } from '../../services/search.service';
import { TableService } from '../../services/table.service';
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
  viewProviders: [{ provide: KeyGridService, useClass: KeyGridService }],
})
export class TableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatSortHeader, { read: ElementRef })
  sortableHeaders: QueryList<ElementRef>;
  @ViewChildren(KeyGridDirective) grid: QueryList<ElementRef>;
  trackBy: (index: number, name: any) => boolean;
  collapseTableQuery: ElementMediaQuery;
  @Input() get filters(): string {
    return this.model.filters;
  }
  set filters(value: string) {
    this.model.filter(value);
  }
  getUnit(field: string) {
    return field === 'MaximumClearance' || field === 'MinimumClearance' ? 'mL/min' : '';
  }

  model: BeersTableDataSource<BeersSearchResult>;
  gridCells: KeyGridDirective[];
  dataSource: BehaviorSubject<BeersSearchResult[]>;
  destroy$ = new Subject();

  handleGridNavigation(event: KeyboardEvent) {
    if (Keys.ARROWS.includes(event.key)) {
      this.keyGridService.handleArrowKeys(event, this.gridCells);
    }
  }
  toggleRow($event: Event, row: ExpandingEntry, force: boolean) {
    $event.stopPropagation();
    this.model.toggle(row, force);
  }
  rowShown(model: BeersTableDataSource<unknown>) {
    return function (index: number, row: TableEntry<unknown> | FlatRowGroup<unknown>) {
      return model.checkIsRowShown(row);
    };
  }
  getPadding(row: TableEntry<BeersSearchResult> | FlatRowGroup<BeersSearchResult>) {
    return (row.position.id.match(/:/g) ?? []).length - 1;
  }
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService,
    @Inject(KeyGridService) private keyGridService: KeyGridService,
    private changeDetect: ChangeDetectorRef,
    public layoutService: LayoutService,
    public filterService: FilterService,
    private element: ElementRef<HTMLElement>,
    private resizerService: ResizerService,
    private renderer: Renderer2
  ) {
    this.model = new BeersTableDataSource();
    this.tableService.entries$.pipe(destroy(this), debounceTime(100)).subscribe((result) => {
      this.model.updateData(result);
    });

    this.columnService.selected$.pipe(destroy(this)).subscribe((selected) => {
      this.model.updateColumns(selected);
    });
    this.groupService.groupedItems$.pipe(destroy(this)).subscribe((groups) => {
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

  ngOnDestroy() {
    this.destroy$.next(true);
  }
  ngAfterViewInit() {
    this.collapseTableQuery = this.resizerService.observeBreakpoint(
      this.element.nativeElement,
      600
    );
    this.collapseTableQuery?.belowBreakpoint$
      .pipe(destroy(this))
      .subscribe((collapsed) => {
        collapsed
          ? this.renderer.addClass(this.element.nativeElement, 'collapsed')
          : this.renderer.removeClass(this.element.nativeElement, 'collapsed');
      })
      .add(() => this.collapseTableQuery.removeObserver());
    this.sort.initialized.pipe(destroy(this)).subscribe(() => {
      this.model.sort = this.sort;
    });
    this.grid.changes.pipe(destroy(this)).subscribe((newCells: QueryList<KeyGridDirective>) => {
      this.gridCells = newCells.toArray();
    });
    const results = this.tableService.entries;
    const columns = this.columnService.selected;
    const groups = this.groupService.groupedItems;
    this.model.updateData(results);
    this.model.updateColumns(columns);
    this.model.updateGroups(groups);
    this.changeDetect.markForCheck();
  }
}
