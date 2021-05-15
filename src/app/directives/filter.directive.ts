import {
  AfterViewInit,
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
  selector: '[filterColumn]',
})
export class FilterDirective implements AfterViewInit {
  @Input() filterColumn: number;
  filterRef: ComponentRef<FilterComponent>;
  private _nativeParent: HTMLElement;
  get filter() {
    return this.filterRef.instance;
  }
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {
    this._nativeParent = this.el.nativeElement;
  }
  createComponent(type: Type<FilterComponent>) {
    this.container.clear();
    const factory: ComponentFactory<FilterComponent> = this.resolver.resolveComponentFactory(
      type
    );

    this.filterRef = this.container.createComponent(factory);

    let row = this._nativeParent.getAttribute('row') as string,
      column = this._nativeParent.getAttribute('column') as string;
    this.renderer.setStyle(
      this.filterRef.location.nativeElement,
      'grid-row',
      '2'
    );
    this.updateGrid(row, column);
  }
  updateGrid(row: string, column: string) {
    this.filter.gridRow = Number(row) + 1;
    this.filter.gridColumn = Number(column);
  }
  ngAfterViewInit() {
    this.createComponent(FilterComponent);
  }
}
