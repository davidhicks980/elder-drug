import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[padLeft]',
})
export class CellPaddingDirective {
  private pad: number = 0;

  @HostBinding('style.paddingLeft')
  get paddingLeft() {
    return this.padding * this.increment + this.units;
  }
  @Input('padLeftIncrement') increment = 10;
  @Input('padLeftUnits') units = 'px';
  @Input('padLeft')
  set padding(value: number) {
    if (this.pad === value) return;
    this.pad = value;
  }
  get padding(): number {
    return this.pad;
  }
}
