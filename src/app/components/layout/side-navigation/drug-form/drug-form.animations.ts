import { animate, state, style, transition, trigger } from '@angular/animations';

export const drugFormAnimations = {
  shiftEditList: (name: string, start: string) =>
    trigger(name, [
      state('unshift', style({ transform: `translateY(-14px)` })),
      state('shift', style({ transform: `translateY(0px)` })),
      transition('unshift <=> shift', animate('240ms ease')),
    ]),
};
