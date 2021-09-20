import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { RowGroup } from '../components/table/RowGroup';
import { KeyGridDirective } from '../directives/keygrid.directive';

@Injectable({
  providedIn: 'root',
})
export class KeyGridService {
  firstRow: number = 0;
  filterCells: Set<KeyGridDirective> = new Set();
  renderer: Renderer2;

  updateFilterCells(cell: KeyGridDirective) {
    this.filterCells.add(cell);
  }

  handleArrowKeys(event: KeyboardEvent, cells: KeyGridDirective[]) {
    const currentElem = event.target as HTMLElement,
      row = Number(currentElem.getAttribute('row')),
      col = Number(currentElem.getAttribute('column'));
    const { rowPos: r, columnPos: c } = this.getPositionFunctions(row, col),
      colCount = c.count(cells, row),
      rowCount = r.count(cells);
    let toRow = 0,
      toCol = 0,
      colAbove = 0,
      colBelow = 0;
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

  private getPositionFunctions(row: number, col: number) {
    const rowPos = {
      prev: (rowCount: number) => (row === 0 ? rowCount : row - 1),
      next: (rowCount: number): number => (row === rowCount ? 0 : row + 1),
      isLast: (rowCount: number): boolean => row === rowCount,
      isFirst: () => row === 0,
      count: (cells: KeyGridDirective[]) => {
        return cells.sort((a, b) => b.row - a.row)[0].row;
      },
    };
    const columnPos = {
      prev: (previousRowColumnCount: number) => {
        return col === 0 ? previousRowColumnCount : col - 1;
      },
      next: (columnsInRow: number) => (col === columnsInRow ? 0 : col + 1),
      isLast: (columnsInRow: number) => col === columnsInRow,
      isFirst: () => col === 0,
      count: (cells: KeyGridDirective[], rowIndex: number) => {
        return cells.reduce((count, item: KeyGridDirective) => {
          return item.row === rowIndex && item.column > count
            ? item.column
            : count;
        }, -1);
      },
    };

    return { rowPos, columnPos };
  }
  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
}
