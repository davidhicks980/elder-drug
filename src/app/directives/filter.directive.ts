import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { FilterComponent } from '../components/table/filter/filter.component';

@Directive({
  selector: '[filter]',
})
export class FilterDirective {
  constructor(
    private parent: ElementRef,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  private _filterShown: boolean = true;
  @Input() filter: number;
  @Input()
  get filterShown(): boolean {
    return this._filterShown;
  }
  set filterShown(value: boolean) {
    this.updateFilterElement(value);
    this._filterShown = value;
  }
  @Input() filterStyle = '';

  updateFilterElement(showFilter: boolean) {
    if (showFilter === false) {
      this.destroyFilter();
    } else if (!this.filterRef) {
      this.createComponent(FilterComponent);
    } else {
      return;
    }
  }
  filterRef: ComponentRef<FilterComponent>;

  createComponent(type: Type<FilterComponent>) {
    const factory: ComponentFactory<FilterComponent> =
      this.resolver.resolveComponentFactory(type);
    this.filterRef = this.container.createComponent(factory);
    this.renderer.setProperty(
      this.filterRef.location.nativeElement,
      'style',
      this.filterStyle
    );
    this.renderer.addClass(this.parent.nativeElement, 'has-filter-attached');
  }
  private destroyFilter() {
    if (this.filterRef) {
      this.filterRef.destroy();
      this.filterRef = undefined;
    }
    if (this.container) {
      this.container.clear();
    }
    this.renderer.removeClass(this.parent.nativeElement, 'has-filter-attached');
  }
}
