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
        enterTiming: '300ms ease-in-out',
        leave: {
          startX: '0px',
          startY: '0px',
          endX: `${amount}`,
          endY: '0px',
        },
        leaveTiming: '300ms ease-in',
      })
    ),

  statefulSidebarShift: (
    name: string,
    amount: number,
    states: string[] = ['open', 'close']
  ) => {
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
          '300ms cubic-bezier(.51,.01,.12,.77)'
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
          '300ms cubic-bezier(.51,.01,.12,.77)'
        ),
      ]),
    ]);
  },
};
