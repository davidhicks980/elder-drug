import {
  animate,
  style,
  trigger,
  state,
  transition,
  sequence,
} from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  // the "in" style determines the "resting" state of the element when it is visible.

  // fade in when created. this could also be written as transition('void => *')
  transition(':enter', [
    style({ opacity: 0 }),

    animate('500ms ease-in', style({ opacity: '*' })),
  ]),
]);

export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-200px)' }),

    animate('450ms ease', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);

export const slideInLeftFast = trigger('slideInLeftFast', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('250ms ease-out', style({ opacity: '*' })),
  ]),
]);

export const dropInAnimation = trigger('dropIn', [
  transition(':enter', [
    style({ boxShadow: 'none', opacity: 0, transform: 'translateY(-5em)' }),
    sequence([
      animate(
        '300ms',
        style({ boxShadow: '2px 2px 10px 2px #808080', opacity: 0.7 })
      ),
      animate(
        '500ms ease',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      animate(
        '600ms ease-in',
        style({ boxShadow: '*', transform: 'translateX(0)' })
      ),
    ]),
  ]),
]);

export const expandButtonAnimation = trigger('expandButton', [
  state('default', style({ transform: 'rotate(0deg)' })),
  state('rotated', style({ transform: 'rotate(90deg)' })),
  transition('rotated => default', animate('400ms ease-out')),
  transition('default => rotated', animate('400ms ease-in')),
]);

export const translateRationaleContent = trigger('translateRationale', [
  transition(':leave', [
    style({ transform: 'translateY(0)' }),
    animate(
      '200ms ease-out',
      style({
        transform: 'translateY(-200px)',
      })
    ),
  ]),
  transition(':enter', [
    style({ transform: 'translateY(-200px)' }),
    animate(
      '200ms ease',
      style({
        transform: 'translateY(0)',
      })
    ),
  ]),
]);

export const slideDownAnimation = trigger('slideDown', [
  // fade in when created. this could also be written as transition('void => *')
  transition(':enter', [
    style({
      transform: 'translateY(-200px)',
    }),
    animate('200ms ease', style({ transform: 'translateY(0px)' })),
  ]),
]);

export const toolbarButtonAnimation = trigger('toolbarMargin', [
  // fade in when created. this could also be written as transition('void => *')
  state('slideIn', style({ transform: 'translateX(0px)' })),
  state('slideOut', style({ transform: 'translateX(0px)' })),
  transition('slideIn <=> slideOut', animate('240ms ease')),
]);

export const inputAnimation = trigger('inputSlideIn', [
  transition(':enter', [
    style({
      transform: 'translateX(-300px)',
    }),
    animate('400ms ease'),
  ]),
  transition(':leave', [
    style({
      transform: 'translateX(0px)',
    }),
    animate('200ms ease'),
  ]),
]);

export const formVisibleAnimation = trigger('toggleForm', [
  state('visible', style({ transform: 'translateX(0em)' })),
  state('hidden', style({ transform: 'translateX(-285px)' })),
  transition('visible => hidden', animate('200ms ease-in')),
  transition('hidden => visible', animate('200ms ease-out')),
]);

export const tableVisibleAnimation = trigger('toggleTables', [
  state('static', style({ width: 'calc(100vw - (285px + 200px)' })),
  state('slide', style({ width: 'calc(100vw - 200px)' })),
  transition('static => slide', animate('400ms ease-out')),
  transition('slide => static', animate('400ms ease-in')),
]);

export const contentAnimation = trigger('toggleContent', [
  state('partial', style({ width: 'calc(100vw - 285px)' })),
  state('full', style({ width: '100vw' })),
  transition('static => slide', animate('400ms ease-out')),
  transition('slide => static', animate('400ms ease-in')),
]);

export const mobileSidenavAnimation = trigger('toggleMobileSidenav', [
  state('visible', style({ transform: 'translateX(0em)' })),
  state('hidden', style({ transform: 'translateX(-100vw)' })),
  transition('visible => hidden', animate('200ms ease-in')),
  transition('hidden => visible', animate('200ms ease-out')),
]);
export const logoSlideAnimation = trigger('logoAnimation', [
  state('fullScreen', style({ transform: 'translateX(-9.75em)' })),
  state('partial', style({ transform: 'translateX(0em)' })),
  transition('fullScreen => partial', animate('200ms ease-in')),
  transition('partial => fullScreen', animate('200ms ease-out')),
]);
