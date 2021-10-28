import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[elderRotate]',
})
export class RotateDirective {
  @HostBinding('style.transform') get rotationStyle() {
    return this.elderRotate ? `rotate(${this.degrees}deg)` : `rotate(0deg)`;
  }
  @HostBinding('style.transition') get transitionStyle() {
    return this.transition;
  }

  @Input() elderRotate: boolean = false;
  @Input() transition: string = 'transform 300ms ease';
  @Input() degrees;
}
