import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[moveable]',
  exportAs: 'moveable',
})
export class MoveableItemDirective {
  @HostBinding('class.moveable')
  @Input()
  moveable = false;
  constructor() {}
}
