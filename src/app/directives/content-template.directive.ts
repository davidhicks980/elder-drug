import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[templateContent]',
})
export class TemplateContentDirective {
  @Input() templateContent: Symbol = Symbol('');
  constructor(public templateRef: TemplateRef<unknown>) {}
}
