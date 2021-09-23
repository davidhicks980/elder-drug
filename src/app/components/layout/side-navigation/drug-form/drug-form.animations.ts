import { animate, state, style, transition, trigger } from '@angular/animations';

export const drugFormAnimations = {
  shiftEditList: (name: string, start: string) =>
    trigger(name, [
      state('unshift', style({ transform: `translateY(${start})` })),
      state('shift', style({ transform: `translateY(0px)` })),
      transition('unshift <=> shift', animate('240ms ease')),
    ]),
  expandAutocomplete: (name: string) =>
    trigger(name, [
      state('closed', style({ transform: 'scale(0.5)', opacity: '0.5' })),
      state('opened', style({ transform: 'scale(1)', opacity: '1' })),
      transition('closed <=> opened', animate('2s ease')),
    ]),
};
