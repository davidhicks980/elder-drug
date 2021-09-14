import { ComponentRef, Directive } from '@angular/core';

@Directive({
  selector: '[contentReference]',
})
export class ContentReferenceDirective<T> {
  constructor(public componentRef: ComponentRef<T>) {}
}
