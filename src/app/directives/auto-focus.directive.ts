import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[elderAutoFocus]',
})
export class AutoFocusDirective {
  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }
}
