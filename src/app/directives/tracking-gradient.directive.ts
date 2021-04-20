import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[tracking-gradient]',
})
export class TrackingGradientDirective {
  width: number = 1;
  height: number = 1;
  gradientChild: SVGPathElement;
  get element() {
    return this.el.nativeElement as SVGElement;
  }
  constructor(private el: ElementRef) {}
  ngOnInit() {
    this.gradientChild = this.element.querySelector(
      '#tracking-gradient'
    ) as SVGPathElement;
    const { width, height } = this.gradientChild.getBBox();
    this.width = width;
    this.height = height;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    let xPos = -1 * (this.width / 2 - $event.offsetX);

    xPos = xPos > 140 ? 140 : xPos;
    xPos = xPos < 4 ? 4 : xPos;

    this.gradientChild.setAttribute(
      'transform',
      `translate(${xPos}, ${-1 * (this.height / 2 - $event.offsetY)})`
    );
  }
  @HostListener('mouseenter', ['$event'])
  onMouseEnter() {
    this.gradientChild.style.display = '';
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.gradientChild.style.display = 'none';
  }
}
