import { transition, trigger } from '@angular/animations';

import { flyInTemplate, shiftTemplate } from '../../animations/templates';

export const layoutAnimations = {
  enterLeaveShift: (name: string, amount: string) =>
    trigger(
      name,
      flyInTemplate({
        enter: {
          startX: `${amount}`,
          startY: '0px',
          endX: '0px',
          endY: '0px',
        },
        enterTiming: '500ms ease-in-out',
        leave: {
          startX: '0px',
          startY: '0px',
          endX: `${amount}`,
          endY: '0px',
        },
        leaveTiming: '500ms ease-in',
      })
    ),

  statefulSidebarShift: (name: string, amount: number, states: number[] = [0, 1]) => {
    const [open, close] = states;
    return trigger(name, [
      transition(`${close} => ${open}`, [
        shiftTemplate(
          {
            startX: `${-1 * amount}px`,
            startY: '0px',
            endX: '0px',
            endY: '0px',
          },
          '400ms ease-in-out'
        ),
      ]),
      transition(`${open} => ${close}`, [
        shiftTemplate(
          {
            startX: `0px`,
            startY: '0px',
            endX: `${-1 * amount}px`,
            endY: '0px',
          },
          '400ms ease-in-out'
        ),
      ]),
    ]);
  },
};
