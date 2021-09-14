import { Directive, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({ selector: '[CreationSpy]' })
export class CreationSpyDirective implements OnInit, OnDestroy {
  @Output('spyInit') spyInit: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    setTimeout(() => this.spyInit.emit(true), 1000);
  }

  ngOnDestroy() {
    this.spyInit.emit(false);
  }
}
