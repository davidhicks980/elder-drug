import { animate, AnimationBuilder, AnimationFactory, style } from '@angular/animations';
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[rotateIcon]',
})
export class RotateDirective {
  previousRotate = false;
  private _rotate: boolean;
  player: any;
  isOpen: any;
  elementRef: any;
  animationBuilder: AnimationBuilder;

  @Input()
  set rotate(rotate: boolean) {
    this.createPlayer(rotate);
  }

  createPlayer(attachment) {
    if (this.player) {
      this.player.destroy();
    }

    let animationFactory: AnimationFactory;

    if (true) {
      animationFactory = this.animationBuilder.build([
        style({ transform: 'rotate(0deg)' }),
        animate(200, style({ transform: 'rotate(90deg)' })),
      ]) as AnimationFactory;
    } else {
      animationFactory = this.animationBuilder.build([
        style({ transform: 'rotate(90deg)' }),
        animate(200, style({ transform: 'rotate(0deg)' })),
      ]) as AnimationFactory;
    }

    this.player = animationFactory.create(attachment);

    this.player.play();
  }

  get rotate() {
    return this._rotate;
  }
  ngOnInit() {
    this.el.nativeElement.style.transition = 'all 0.5s ease';
  }
  constructor(private el: ElementRef, animationBuilder: AnimationBuilder) {
    this.rotate = false;
    this.animationBuilder = animationBuilder;
  }
}
