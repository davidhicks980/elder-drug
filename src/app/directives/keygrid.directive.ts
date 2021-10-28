import { ListKeyManagerOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
interface FocusableOption extends ListKeyManagerOption {
  focus(): void;
}
@Directive({
  selector: '[keyGrid]',
})
export class KeyGridDirective {
  private _keyGrid: { col: number; row: number } = { col: 0, row: 0 };

  focus() {
    this.element.focus();
  }

  @Input() get keyGrid(): { col: number; row: number } {
    return this._keyGrid;
  }
  set keyGrid(value: { col: number; row: number }) {
    this.column = value.col;
    this.row = value.row;
    this._keyGrid = value;
  }
  @HostBinding('attr.data-column')
  @Input()
  column: number = 0;

  @HostBinding('attr.data-row')
  @Input()
  row: number = 0;
  get element() {
    return this._element.nativeElement as HTMLElement;
  }
  constructor(private _element: ElementRef) {}
}
