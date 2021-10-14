import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';

import { MenuToggleComponent } from '../components/layout/menu-toggle/menu-toggle.component';

@Directive({
  selector: '[elderRowToggle]',
})
export class RowToggleDirective<T> implements AfterViewInit {
  toggleFactory: any;

  toggle: any;
  private createToggle<T>(): ComponentRef<T> {
    if (!this.toggleFactory) {
      this.toggleFactory = this.createFactory();
    }
    return this.container.createComponent(this.toggleFactory);
  }
  private createFactory(): ComponentFactory<MenuToggleComponent> {
    this.container.clear();
    return this.resolver.resolveComponentFactory(
      MenuToggleComponent
    ) as ComponentFactory<MenuToggleComponent>;
  }
  private destroyPanel() {
    if (this.toggle) {
      this.toggle.destroy();
      this.toggle = undefined;
    }
  }
  ngAfterViewInit() {
    this.toggle = this.createToggle();
    this.renderer.appendChild(this.ref.nativeElement, this.toggle);
  }
  constructor(
    private ref: ElementRef,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
}
