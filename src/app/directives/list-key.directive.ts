import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[listKey]',
})
export class ListKeyDirective implements FocusableOption {
  @HostBinding('attr.label')
  private label: string = '';
  focus() {
    this.element.nativeElement.focus();
  }
  @HostBinding('attr.disabled')
  disabled?: boolean = false;

  getLabel?() {
    return this.label;
  }
  setLabel(value: string) {
    this.label = String(value);
  }
  @Input()
  listKey: string = '';

  constructor(private element: ElementRef) {}
}
