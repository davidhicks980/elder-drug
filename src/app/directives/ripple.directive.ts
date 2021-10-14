import { animate, AnimationBuilder, AnimationMetadata, style } from '@angular/animations';
import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[elderRipple]',
})
export class RippleDirective implements AfterViewInit {
  rippleElement: HTMLElement;
  @HostListener('pointerdown') mouseDown() {
    this.playAnimation(this.getFadeInAnimation());
  }

  @HostListener('pointerup') mouseUp() {
    this.playAnimation(this.getFadeOutAnimation());
  }

  ngAfterViewInit() {
    this.renderer.setStyle(this.element.nativeElement, 'position', 'relative');
    this.rippleElement = this.renderer.createElement('span');
    this.renderer.setAttribute(
      this.rippleElement,
      'style',
      `height: 100%;
        width: 100%;
      z-index: 99999;
      background-image: radial-gradient(circle at 50% 50%, black 10%, transparent 11%);
      pointer-events:none;
      display:inline-block;
      position:absolute;top:0; left:0; bottom:0; right:0;
      opacity:0`
    );
    this.renderer.appendChild(this.element.nativeElement, this.rippleElement);
  }
  constructor(
    private builder: AnimationBuilder,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  private playAnimation(animationMetaData: AnimationMetadata[]): void {
    const animation = this.builder.build(animationMetaData);
    const player = animation.create(this.rippleElement);
    player.play();
  }

  private getFadeInAnimation(): AnimationMetadata[] {
    return [
      animate('100ms ease-in', style({ transform: 'scale(0)', opacity: 0 })),
      animate('300ms ease-out', style({ transform: 'scale(2)', opacity: 1 })),
    ];
  }

  private getFadeOutAnimation(): AnimationMetadata[] {
    return [animate('400ms ease-in', style({ transform: 'scale(2)', opacity: 0 }))];
  }
}
