import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { debounce } from '../functions/debounce';

@Directive({
  selector: '[tracking-gradient]',
})
export class TrackingGradientDirective implements AfterViewInit {
  private width: number = 1;
  private height: number = 1;
  private track: boolean = false;

  gradientId: string;
  gradientChild: SVGRectElement;
  removeMouseListener: () => void;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  private createGradientRect(id: string) {
    let rect = this.createSVG('rect') as SVGRectElement;
    this.setSVGAttribute(rect, 'width', '120px');
    this.setSVGAttribute(rect, 'height', '200px');
    this.setSVGAttribute(rect, 'fill', `url(#${id})`);
    return rect;
  }

  private generateGradientId() {
    return String(Math.round(Math.random() * 10 ** 6)) + String(Date.now());
  }

  private createSVG(name: string) {
    return this.renderer.createElement(name, 'svg');
  }

  private setSVGAttribute(element: SVGElement, attribute: string, value: string) {
    this.renderer.setAttribute(element, attribute, value);
  }

  private createGradientDefinition(id: string) {
    let gradient = this.createSVG('radialGradient') as SVGGradientElement,
      defs = this.createSVG('defs') as SVGDefsElement,
      stopStart = this.createSVG('stop') as SVGStopElement,
      stopEnd = this.createSVG('stop') as SVGStopElement;
    this.setSVGAttribute(gradient, 'id', id);
    this.setSVGAttribute(stopStart, 'offset', '0%');
    this.setSVGAttribute(stopStart, 'stop-color', 'rgba(255, 255, 255, 0.08)');
    this.setSVGAttribute(stopEnd, 'offset', '70%');
    this.setSVGAttribute(stopEnd, 'stop-color', 'rgba(255, 255, 255, 0)');
    this.renderer.appendChild(defs, gradient);
    this.renderer.appendChild(gradient, stopStart);
    this.renderer.appendChild(gradient, stopEnd);
    return defs;
  }

  private buildGradient() {
    this.gradientId = this.generateGradientId();
    const gradientDefinition = this.createGradientDefinition(this.gradientId);
    this.renderer.appendChild(this.element.nativeElement, gradientDefinition);
    this.gradientChild = this.createGradientRect(this.gradientId);
    this.renderer.appendChild(this.element.nativeElement, this.gradientChild);
    const { width, height } = this.gradientChild.getBBox();
    this.width = width;
    this.height = height;
  }

  ngAfterViewInit() {
    this.buildGradient();
  }
  mouseMoveHandler($event: MouseEvent) {
    if (this.track) {
      let xPos = -1 * (this.width / 2 - $event.offsetX);
      xPos = xPos > 90 ? 90 : xPos;
      xPos = xPos < -20 ? -20 : xPos;

      this.renderer.setStyle(
        this.gradientChild,
        'transform',
        `translate(${xPos}px, ${-1 * (this.height / 2 - $event.offsetY)}px)`
      );
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter() {
    this.renderer.appendChild(this.element.nativeElement, this.gradientChild);
    this.removeMouseListener = this.renderer.listen(
      this.element.nativeElement,
      'mousemove',
      debounce(this.mouseMoveHandler.bind(this), 20)
    );
    this.track = true;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.track = false;
    this.removeMouseListener();
    this.renderer.removeChild(this.element.nativeElement, this.gradientChild);
  }
}
