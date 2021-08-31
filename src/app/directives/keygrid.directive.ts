import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[keyGrid]',
  exportAs: 'keyboardGrid',
})
export class KeyGridDirective {
  private _keyGrid: { col: number; row: number } = { col: 0, row: 0 };

  @Input() public get keyGrid(): { col: number; row: number } {
    return this._keyGrid;
  }
  public set keyGrid(value: { col: number; row: number }) {
    this._keyGrid = value;
  }
  @HostBinding('attr.column')
  public get column(): number {
    return this._keyGrid.col;
  }
  @HostBinding('attr.row')
  public get row(): number {
    return this._keyGrid.row;
  }

  get element() {
    return this._element.nativeElement as HTMLElement;
  }
  constructor(private _element: ElementRef) {}
}