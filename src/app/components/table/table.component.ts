import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';

import { slideDownAnimation } from '../../animations';
import { ARROW_KEYS } from '../../constants/keys.constants';
import { FilterDirective } from '../../directives/filter.directive';
import { KeyGridDirective } from '../../directives/keygrid.directive';
import { ColumnService } from '../../services/columns.service';
import { DataService } from '../../services/data.service';
import { GroupByService } from '../../services/group-by.service';
import { TableService } from '../../services/table.service';
import { BeersTableDataSource } from './BeersTableDataSource';
import { ExpandingEntry } from './ExpandingEntry';
import { Paginator } from './Paginator';
import { RowGroup } from './RowGroup';

@Component({
  selector: 'elder-table',
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
    './table.row.component.scss',
    './table.cell.component.scss',
  ],

  animations: [
    slideDownAnimation,

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
  @ViewChildren('headerCell', { read: ElementRef })
  sortableHeaders: QueryList<ElementRef>;
  @ViewChildren(FilterDirective)
  headers: QueryList<FilterDirective>;
  //HTMLSectionElement
  @ViewChild('elderTable') container: ElementRef;
  @ViewChildren(KeyGridDirective) grid: QueryList<ElementRef>;
  model: BeersTableDataSource<ExpandingEntry, Paginator>;
  selectedRow: any;
  _rowLength: number;
  _columnLength: number;
  gridCells: KeyGridDirective[];
  FIRST_ROW = 2;
  filterCells: Set<KeyGridDirective> = new Set();

  constructor(
    private columnService: ColumnService,
    private dataService: DataService,
    private table: TableService,
    private groupServ: GroupByService,
    private renderer: Renderer2
  ) {
    this.dataService = dataService;
    this.columnService = columnService;
    this.model = new BeersTableDataSource(
      this.dataService.tableSource as any,
      this.columnService.observeActiveColumns$
    );
    const groupChanges = this.groupServ.groupChanges.pipe(
      map((groups) => groups.map((group) => group.trim()))
    );
    groupChanges.subscribe((groups) => this.model.updateGroups(groups));

    this.table.tableFilter$.subscribe(({ column, term }) =>
      this.model.filter(column, term)
    );
  }
  ngAfterViewInit() {
    this.sort.initialized.subscribe(() => {
      this.model.sort = this.sort;
    });
    this.grid.changes.subscribe((newCells: QueryList<KeyGridDirective>) => {
      this.gridCells = newCells.toArray();
    });
  }

  getRowIndex(row: ExpandingEntry, add = 0) {
    return row._position.index + this.FIRST_ROW + add;
  }
  trackRowBy(_index, item: ExpandingEntry) {
    return (
      item._position.hash +
      item._position.expanded +
      item._position.parentExpanded
    );
  }
  rowIsEntry(_index, row: ExpandingEntry) {
    return row._position.isGroup === false;
  }

  parentIsExpanded(row: ExpandingEntry) {
    return this.model.checkIsParentExpanded(row);
  }
  rowIsGroup(_index, row: ExpandingEntry) {
    return row._position.isGroup === true;
  }
  updateFilterCells(cell: KeyGridDirective) {
    this.filterCells.add(cell);
  }
  handleGridNavigation(event: KeyboardEvent) {
    if (ARROW_KEYS.includes(event.key)) {
      this._handleArrowKeys(event);
    }
  }
  _handleArrowKeys(event: KeyboardEvent) {
    const cells = this._getKeyGridCells();
    const currentElem = event.target as HTMLElement;
    const row = Number(currentElem.getAttribute('row'));
    const col = Number(currentElem.getAttribute('column'));
    const { r, c } = this._getPositionFns(row, col);
    const colCount = c.count(cells, row);
    const rowCount = r.count(cells);
    let toRow = 0;
    let toCol = 0;
    let colAbove = 0;
    let colBelow = 0;
    switch (event.key) {
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        toRow = c.isLast(colCount) ? r.next(rowCount) : row;
        toCol = c.next(colCount);
        break;
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        toRow = r.next(rowCount);
        /**/ colBelow = c.count(cells, toRow);
        toCol = colBelow < col ? colBelow : col;
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        toRow = c.isFirst() ? r.prev(rowCount) : row;
        toCol = c.prev(c.count(cells, r.prev(rowCount)));
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        toRow = r.prev(rowCount);
        /**/ colAbove = c.count(cells, toRow);
        toCol = colAbove < col ? colAbove : col;
        break;
      default:
        return; // Quit if this doesn't handle the key event.
    }
    const predicate = (item) => item.column == toCol && item.row == toRow;
    const nextElem = cells.filter(predicate)[0].element;
    this.renderer.setAttribute(nextElem, 'tabindex', '0');
    this.renderer.setAttribute(currentElem, 'tabindex', '-1');
    nextElem.focus();
    return true;
  }
  getExpansionHeader = (row: RowGroup) => row.groupHeader;

  private _getKeyGridCells(): KeyGridDirective[] {
    let filters = [];
    try {
      filters = this.headers.map(
        (header) => header?.filterRef?.instance?.grid
      ) as KeyGridDirective[];
    } catch (err) {
      throw new Error(err);
    }
    const cells =
      Array.isArray(filters) && filters.length > 0
        ? [...this.gridCells, ...filters]
        : this.gridCells;
    return cells;
  }

  private _getPositionFns(row: number, col: number) {
    ///////////////////////////////////////////////

    const r = {
      prev: (rowCount: number) => (row === 0 ? rowCount : row - 1),
      next: (rowCount: number): number => (row === rowCount ? 0 : row + 1),
      isLast: (rowCount: number): boolean => row === rowCount,
      isFirst: () => row === 0,
      count: (cells: KeyGridDirective[]) =>
        cells.sort(
          (a: KeyGridDirective, b: KeyGridDirective) => b.row - a.row
        )[0].row,
    };
    const c = {
      prev: (columnsInPreviousRow: number) =>
        col === 0 ? columnsInPreviousRow : col - 1,
      next: (columnsInRow: number) => (col === columnsInRow ? 0 : col + 1),
      isLast: (columnsInRow: number) => col === columnsInRow,
      isFirst: () => col === 0,
      count: (cells: KeyGridDirective[], rowIndex: number) =>
        cells.reduce(
          (count, item: KeyGridDirective) =>
            item.row === rowIndex && item.column > count ? item.column : count,
          -1
        ),
    };

    return { r, c };
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
