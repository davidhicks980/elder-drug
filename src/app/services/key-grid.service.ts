import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CellPosition {
  row: number;
  column: number;
}
enum Axis {
  HORIZONTAL = 'row',
  VERTICAL = 'column',
}
enum QueryPosition {
  BEFORE,
  AFTER,
  EITHER,
}
interface A11yGridCellPosition {
  row: number;
  column: number;
}
type A11yGridCellEntry = {
  nonce;
} & A11yGridCellPosition;

@Injectable()
export class KeyGridService {
  nextColumn: (row: number, column: number) => number;
  previousColumn: (row: number, column: number) => number;
  nearestColumn: (column: number, row: number) => number;
  nextRow: (row: number) => number;
  previousRow: (row: number) => number;
  nearestRow: (row: number) => number;
  getColumns: (rowConstraint: number) => number[];
  getRows: (constrainToColumn?: number) => number[];
  lastColumn: (inRow?: number) => number;
  lastRow: (inColumn?: number) => number;
  firstColumn: (inRow?: number) => number;
  firstRow: (inColumn?: number) => number;
  private mappedCells: Map<string, A11yGridCellPosition> = new Map();
  private lastCoordinates: { row: number; column: number } = { row: 0, column: 0 };
  private allowFocus: boolean;
  private focusSource: BehaviorSubject<string> = new BehaviorSubject(undefined);
  focusedElement$: Observable<string> = this.focusSource.asObservable();
  get enabled() {
    return this.allowFocus;
  }
  enable() {
    this.allowFocus = true;
  }
  disable() {
    this.allowFocus = false;
  }
  get focusedCell() {
    return this.focusSource.getValue();
  }
  get gridCells(): A11yGridCellEntry[] {
    return Array.from(this.mappedCells)
      .sort((a, b) => a[1].row - b[1].row)
      .map(([nonce, { row, column }]) => {
        return { row, column, nonce };
      });
  }
  constructor() {
    let { BEFORE, AFTER, EITHER } = QueryPosition;
    let { HORIZONTAL, VERTICAL } = Axis;
    this.nextColumn = (column, row?) => this.queryAdjacentCell(HORIZONTAL, column, AFTER, row);
    this.previousColumn = (column, row?) => this.queryAdjacentCell(HORIZONTAL, column, BEFORE, row);
    this.nearestColumn = (column, row?) => this.queryAdjacentCell(HORIZONTAL, column, EITHER, row);
    this.nextRow = (row: number) => this.queryAdjacentCell(VERTICAL, row, AFTER);
    this.previousRow = (row: number) => this.queryAdjacentCell(VERTICAL, row, BEFORE);
    this.nearestRow = (row: number) => this.queryAdjacentCell(VERTICAL, row, EITHER);
    this.getColumns = (inRow?: number) => this.getUniqueCellsOnAxis(HORIZONTAL, inRow);
    this.getRows = (inColumn?: number) => this.getUniqueCellsOnAxis(VERTICAL, inColumn);
    this.lastColumn = (inRow?: number) => this.getColumns(inRow)?.slice(-1)[0];
    this.lastRow = (inColumn?: number) => this.getRows(inColumn)?.slice(-1)[0];
    this.firstColumn = (inRow?: number) => this.getColumns(inRow)[0];
    this.firstRow = (inColumn?: number) => this.getRows(inColumn)[0];
  }

  focusCell(nonce?: string) {
    let { row, column } = this.mappedCells.get(nonce);
    this.focusCellAtPosition(row, column);
  }
  updateCell(nonce: string, row: number, column: number): void {
    this.mappedCells.set(nonce, { row, column });
    if (this.lastCoordinates.row === row && this.lastCoordinates.column === column) {
      this.focusSource.next(nonce);
    }
  }

  deleteCell(nonce: string): void {
    if (this.mappedCells.has(nonce)) {
      this.mappedCells.delete(nonce);
      if (nonce === this.focusedCell) {
        setTimeout(this.refocusLastCoordinates.bind(this));
      }
    }
  }
  private refocusLastCoordinates() {
    let { row, column } = this.lastCoordinates;
    let success = this.focusCellAtPosition(row, column);
    if (!success) {
      let nextRow = this.previousRow(row);
      let nextColumn = this.previousColumn(nextRow, column);
      this.focusCellAtPosition(nextRow, nextColumn);
    }
  }

  private findCell(row: number, column: number) {
    return this.gridCells.find((cell) => cell.row === row && cell.column === column);
  }
  private focusCellAtPosition(row: number, column: number): boolean {
    this.lastCoordinates = { row, column };
    let cell = this.findCell(row, column);
    if (cell) {
      this.focusSource.next(cell.nonce);
    }
    return !!cell;
  }
  private getUniqueCellsOnAxis(axis: Axis, indexConstraint?: number): number[] {
    if (!this.mappedCells.size) {
      return [];
    }
    let cellType = axis === Axis.HORIZONTAL ? Axis.VERTICAL : Axis.HORIZONTAL;
    let cells =
      typeof indexConstraint === 'number'
        ? this.gridCells.filter((cell) => cell[axis] === indexConstraint)
        : this.gridCells;
    return [...new Set(cells.map((cell) => cell[cellType]).sort((a, b) => a - b))];
  }

  handleKeyPress(key: string, ctrlKey: boolean): CellPosition {
    if (!this.mappedCells.size) return;

    let { column, row } = this.gridCells.find(
      (cell) => cell.column === this.lastCoordinates.column && cell.row === this.lastCoordinates.row
    ) || { row: 0, column: 0 };

    let nextRow = 0,
      nextColumn = 0;

    switch (key) {
      case 'Home':
        //Ctrl: If a cell has focus, moves focus to the cell in the first row in the same column as the cell that had focus.
        //No ctrl: If a cell is focused, moves focus to the first cell in the row containing focus.
        nextRow = ctrlKey ? this.firstRow() : row;
        nextColumn = ctrlKey
          ? Math.min(this.lastColumn(nextRow), column)
          : this.firstColumn(nextRow);
        break;
      case 'End':
        //Ctrl: If a cell has focus, moves focus to the cell in the last row in the same column as the cell that had focus.
        //No ctrl: If a cell is focused, moves focus to the last cell in the row containing focus.
        nextRow = ctrlKey ? this.lastRow() : row;
        nextColumn = ctrlKey
          ? Math.min(this.lastColumn(nextRow), column)
          : this.lastColumn(nextRow);
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        nextRow = row;
        nextColumn = this.nextColumn(column, nextRow);
        break;
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        nextRow = this.nextRow(row);
        nextColumn = this.nearestColumn(column, nextRow);
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        nextRow = this.previousRow(row);
        nextColumn = this.nearestColumn(column, nextRow);
        break;
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        nextRow = row;
        nextColumn = this.previousColumn(column, nextRow);
        break;
      case ' ':
      case 'Enter':
        nextRow = this.lastCoordinates.row;
        nextColumn = this.lastCoordinates.column;
        break;
      default:
        return;
    }
    this.focusCellAtPosition(nextRow, nextColumn);
  }
  private getClosestCell(index: number, cells: number[], searchFrom: number): number {
    return cells.reduce((closest: number, cell: number) => {
      return Math.abs(cell - index) < Math.abs(closest - index) ? cell : closest;
    }, cells[searchFrom]);
  }

  private queryAdjacentCell(
    axis: Axis,
    cell: number,
    position: QueryPosition,
    constrainToAxisIndex?: number
  ): number {
    let cells =
      axis === Axis.HORIZONTAL
        ? this.getColumns(constrainToAxisIndex ?? undefined)
        : this.getRows(constrainToAxisIndex ?? undefined);
    if (!cells.length) {
      return cell;
    }
    if (cells.length === 1) {
      return cells[0];
    }
    const lastCell = cells.slice(-1)[0],
      firstCell = cells[0],
      cellIndex = cells.indexOf(cell);
    if (cellIndex === -1) {
      return this.getClosestCell(cell, cells, 0);
    }
    switch (position) {
      case QueryPosition.BEFORE:
        return cellIndex === 0 ? lastCell : cells[cellIndex - 1];
      case QueryPosition.AFTER:
        return cellIndex === lastCell ? firstCell : cells[cellIndex + 1];
      default:
        return cell;
    }
  }
}
