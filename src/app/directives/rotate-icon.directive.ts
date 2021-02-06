import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[rotateIcon]',
})
export class RotateDirective {
  previousRotate = true;
  private _rotate: boolean;
  player: AnimationPlayer;
  isOpen: any;
  elementRef: any;
  animationBuilder: AnimationBuilder;
  playForward: Animation;
  @HostListener('click', ['$event']) onClick($event) {}

  createPlayer() {}

  constructor(private el: ElementRef, animationBuilder: AnimationBuilder) {
    this.animationBuilder = animationBuilder;
    this.createPlayer();
  }
}
