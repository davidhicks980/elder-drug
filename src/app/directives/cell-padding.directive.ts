import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[cellPadding]',
})
export class CellPaddingDirective {
  private _cellPadding: number;

  @Input()
  public set cellPadding(value: number) {
    this._cellPadding = value;
    this.el.nativeElement.style.paddingLeft = value * 20 + 'px';
  }
  public get cellPadding(): number {
    return this._cellPadding;
  }

  constructor(private el: ElementRef) {}
}
