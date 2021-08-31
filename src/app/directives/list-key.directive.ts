import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  QueryList,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[elderListKey]',
})
export class ListKeyDirective implements FocusableOption, AfterContentInit {
  @ContentChildren(ListKeyDirective) ListItems: QueryList<ListKeyDirective>;
  keyHandler: FocusKeyManager<ListKeyDirective>;
  focus() {
    this.element.nativeElement.focus();
  }
  ngAfterContentInit() {
    this.keyHandler = new FocusKeyManager(this.ListItems).withWrap();
  }
  onKeydown(event) {
    this.keyHandler.onKeydown(event);
  }
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.element.nativeElement, 'tabindex', '0');
  }
}
