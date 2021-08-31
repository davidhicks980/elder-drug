import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  /**
   * Current item exposed in implicit value variable.
   * This enables us to use the let syntax
   *
   * @example
   * <ng-container *appLet="data$ | async; let data">
   *   Data: {{data}}
   * </ng-container>
   */
  $implicit?: T; // current item exposed as implicit value
  /**
   * Current item exposed as key matching the directive name.
   * This adds support for `as` syntax in template.
   *
   * @example
   * <ng-container *appLet="data$ | async as data">
   *   Data: {{data}}
   * </ng-container>
   */
  elderLet?: T;
}
@Directive({
  selector: '[elderLet]',
})
export class LetDirective<T> {
  private context: LetContext<T> = {
    $implicit: undefined,
    elderLet: undefined,
  };

  constructor(
    private readonly viewRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<LetContext<T>>
  ) {
    this.viewRef.createEmbeddedView(this.templateRef, this.context);
  }

  @Input()
  set elderLet(value: T) {
    this.context.elderLet = this.context.$implicit = value;
  }
}
