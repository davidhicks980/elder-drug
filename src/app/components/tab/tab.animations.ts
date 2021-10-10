import { animate, style, transition, trigger } from '@angular/animations';

import { enterLeaveFadeTemplate } from '../../../animations/templates';

export const tabAnimations = {
  round: (name: string) =>
    trigger(name, [
      transition(':enter', [
        style({
          transform: 'scaleX(2) translate(3%, 0) ',
          transformOrigin: 'center',
        }),
        animate(
          '400ms ease',
          style({
            transform: 'translate(3%, 0)  scaleX(1)',
            transformOrigin: 'center',
          })
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'scaleX(1) translate(3%, 0) ',
          transformOrigin: 'center',
        }),
        animate(
          '400ms ease',
          style({
            transform: 'translate(3%, 0)  scaleX(2)',
            transformOrigin: 'center',
          })
        ),
      ]),
    ]),
  fade: (name: string) => trigger(name, enterLeaveFadeTemplate('400ms ease-in', '400ms ease-in')),
};