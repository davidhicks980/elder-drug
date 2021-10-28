import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, Renderer2, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[svgGradient]',
})
export class SvgGradientDirective {
  private _visible: string = '';
  fill: string = '';
  @ViewChild(SvgGradientDirective) children;
  refresh: boolean;
  svg: Promise<SVGElement>;
  @HostBinding('style.--svg-fill')
  get svgFill() {
    return this.fill;
  }
  @Input('svgGradient')
  gradient: Record<string, string> = { '0': '#fff', '1': '#000' };
  @Input('svgGradientType') type: 'linear' | 'radial' = 'linear';
  definition: SVGDefsElement;
  @Input('svgGradientAngle') angle: number = 0;
  @Input('svgGradientName')
  get name(): string {
    return this._visible;
  }
  set name(value: string) {
    if (value != this._visible) {
      this._visible = value;
      this.registry
        .getNamedSvgIcon(value)
        .pipe(take(1))
        .subscribe((icon: SVGSVGElement) => {
          this.appendSVG(icon);
        });
    }
  }

  appendSVG(icon: SVGSVGElement) {
    this.renderer.selectRootElement(this.element.nativeElement);
    this.gradientId = this.generateGradientId();
    let def = this.createGradientDefinition(this.gradientId);
    this.renderer.appendChild(icon, def);
    this.fill = `url(#${this.gradientId})`;
    this.renderer.appendChild(this.element.nativeElement, icon);
    this.changeDetect.markForCheck();
  }

  gradientId: string;
  svgGradient: SVGGradientElement;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private registry: MatIconRegistry,
    private changeDetect: ChangeDetectorRef
  ) {}

  private generateGradientId() {
    return String(Math.round(Math.random() * 10 ** 6)) + String(Date.now());
  }
  private createSVG(name: string) {
    return this.renderer.createElement(name, 'svg');
  }
  private setSVGAttribute(element: SVGElement, attribute: string, value: string) {
    this.renderer.setAttribute(element, attribute, value);
    return (nextAttribute, nextValue) => this.setSVGAttribute(element, nextAttribute, nextValue);
  }

  private createGradientDefinition(id: string) {
    const svgGradient = this.createSVG(`${this.type}Gradient`) as SVGGradientElement;
    let definition = this.createSVG('defs') as SVGDefsElement;
    this.setSVGAttribute(svgGradient, 'id', id)('gradientTransform', `rotate(${this.angle})`);
    this.createGradientStops(this.gradient).forEach((stop) => {
      this.renderer.appendChild(svgGradient, stop);
    });
    this.renderer.appendChild(definition, svgGradient);
    return definition;
  }

  private createGradientStops(gradient: Record<number, string>) {
    return Object.entries(gradient).map(([offset, color]) => {
      let stop = this.createSVG('stop');
      this.setSVGAttribute(stop, 'stop-color', color)('offset', Number(offset));
      return stop;
    });
  }
}
