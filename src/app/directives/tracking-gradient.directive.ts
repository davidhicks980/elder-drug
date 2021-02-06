import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[tracking-gradient]',
})
export class TrackingGradientDirective {
  constructor(private el: ElementRef) {
    this.element.style.backgroundRepeat = 'no-repeat';
  }

  @Input() trackHighlight: string;
  @Input() trackBackground: string;
  get element() {
    return this.el.nativeElement as HTMLButtonElement;
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    this.changeBackgroundPosition(
      `${Math.floor($event.offsetX)}px ${Math.floor($event.offsetY)}px`
    );
  }
  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderHighlightBackground();
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.renderDefaultBackground();
  }
  renderDefaultBackground() {
    this.element.style.background = this.trackBackground;
  }
  renderHighlightBackground() {
    this.element.style.background = `radial-gradient(circle at center, ${
      this.trackBackground + '80% , ' + this.trackHighlight + '90%'
    })`;
    this.element.style.backgroundSize = '200%';
  }
  changeBackgroundPosition(coordinate) {
    this.element.style.backgroundPosition = coordinate;
  }
}
