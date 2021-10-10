import { animate, state, style, transition, trigger } from '@angular/animations';

export const tabLinkAnimations = {
  clipTab: (name: string, shiftedState: string, unshiftedState: string) =>
    trigger(name, [
      state(unshiftedState, style({ transform: 'translate(0px)' })),
      state(shiftedState, style({ transform: 'translate(-10px)' })),

      transition(
        `${unshiftedState} <=> ${shiftedState}`,
        animate(`1s cubic-bezier(.17,.67,.88,.1)`)
      ),
    ]),
  roundedSVG: (name: string) =>
    trigger(name, [
      transition(':enter', [
        style({ transform: 'scale(2)' }),
        animate(3000, style({ transform: 'scale(0.5)' })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(0.5)' }),
        animate(3000, style({ transform: 'scale(2)' })),
      ]),
    ]),
};
//'translate(3%, -3%) scale(0.9)'
