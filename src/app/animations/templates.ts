import {
  animate,
  animation,
  AnimationReferenceMetadata,
  style,
  transition,
  useAnimation,
} from '@angular/animations';

/** @params startOpacity, time, endOpacity */

export const customFadeIn = animation([
  style({
    opacity: '{{ startOpacity }}',
  }),
  animate('{{ time }}', style({ opacity: '{{endOpacity}}' })),
]);
export const customFlyIn = animation([
  style({
    transform: 'translate({{startX}}, {{startY}})',
  }),
  animate('{{ timing }}', style({ transform: 'translate({{endX}}, {{endY}})' })),
]);

export const enterLeaveTemplate = (
  enterAnimation?: AnimationReferenceMetadata,
  leaveAnimation?: AnimationReferenceMetadata
) => {
  let transitions = [];
  if (enterAnimation) {
    transitions.push(transition(':enter', enterAnimation));
  }
  if (leaveAnimation) {
    transitions.push(transition(':leave', leaveAnimation));
  }
  return transitions;
};

export const stateFadeTemplate = (enterTiming, leaveTiming) =>
  enterLeaveTemplate(
    useAnimation(customFadeIn, {
      params: {
        startOpacity: 0,
        endOpacity: 1,
        time: enterTiming,
      },
    }),
    useAnimation(customFadeIn, {
      params: {
        startOpacity: 1,
        endOpacity: 0,
        time: leaveTiming,
      },
    })
  );
export const enterLeaveFadeTemplate = (enterTiming, leaveTiming) =>
  enterLeaveTemplate(
    useAnimation(customFadeIn, {
      params: {
        startOpacity: 0,
        endOpacity: 1,
        time: enterTiming,
      },
    }),
    useAnimation(customFadeIn, {
      params: {
        startOpacity: 1,
        endOpacity: 0,
        time: leaveTiming,
      },
    })
  );
export interface AnimationPosition {
  startX?: string;
  startY?: string;
  endX?: string;
  endY?: string;
}
export const flyInTemplate = (keyframes: {
  enter?: AnimationPosition | false;
  enterTiming?: string | false;
  leave?: AnimationPosition | false;
  leaveTiming?: string | false;
}) => {
  let enter, leave;
  if (keyframes.enter) {
    let params = {
      ...keyframes.enter,
      timing: keyframes.enterTiming || '1s ease',
    };

    enter = useAnimation(customFlyIn, { params });
  }
  if (keyframes.leave) {
    let params = {
      ...keyframes.leave,
      timing: keyframes.leaveTiming || '1s ease',
    };
    leave = useAnimation(customFlyIn, {
      params,
    });
  }
  return enterLeaveTemplate(enter, leave);
};

export type FadeAnimation = {
  startOpacity: string;
  endOpacity: string;
};
export const shiftTemplate = (position: AnimationPosition, timing: string) =>
  useAnimation(customFlyIn, { params: { ...position, timing } });
export const fadeStateTemplate = (fadeParameters: FadeAnimation, timing: string) =>
  useAnimation(customFlyIn, { params: { ...fadeParameters, timing } });
