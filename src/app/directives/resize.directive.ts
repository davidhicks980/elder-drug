import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { Subscription } from 'rxjs';
import { ResizeService } from '../services/resize.service';
@Directive({
  selector: '[mobileListener]',
})
export class ResizeDirective implements OnDestroy {
  @Input() triggerWidth: number = 600;

  @Output() isMobile: EventEmitter<boolean> = new EventEmitter();
  subscription: Subscription;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private resize: ResizeService
  ) {
    this.subscription = this.resize
      .observe(this.element.nativeElement, this.triggerWidth)
      .subscribe(this.toggleClass(this.renderer, this.element.nativeElement));
  }
  toggleClass(renderer: Renderer2, element) {
    return (val: boolean) =>
      val
        ? renderer.addClass(element, 'is-mobile')
        : renderer.removeClass(element, 'is-mobile');
  }
}
