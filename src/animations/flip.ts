import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export function flip(name = 'flip', first = true, duration = 350, easing = 'ease-in-out') {
  const timings = `${duration}ms ${easing}`;
  return trigger(name, [
    state(first ? 'first' : 'second', style({ transform: `rotateY(${first ? 360 : 0}deg)`, display: 'block' })),
    state(first ? 'second' : 'first', style({ transform: `rotateY(180deg)`, display: 'none' })),
    transition(':enter', animate(0)),
    transition('* => *', animate(`${duration}ms ${easing}`)),
    transition(
      first ? 'second => first' : 'first => second',
      animate(timings, keyframes([style({ display: 'none', offset: 0 }), style({ display: 'block', offset: 0.2 })])),
    ),
  ]);
}

export const flipFront = trigger('showFront', [
  state('first', style({ transform: `rotateY(360deg)`, display: 'block' })),
  state('second', style({ transform: `rotateY(180deg)`, display: 'none' })),
  transition(':enter', animate(0)),
  transition('* => *', animate(`350ms ease-in-out`)),
  transition(
    'second => first',
    animate(
      '350ms ease-in-out',
      keyframes([style({ display: 'none', offset: 0 }), style({ display: 'block', offset: 0.2 })]),
    ),
  ),
]);

export const flipBack = trigger('showBack', [
  state('first', style({ transform: `rotateY(180deg)`, display: 'none' })),
  state('second', style({ transform: `rotateY(0deg)`, display: 'block' })),
  transition(':enter', animate(0)),
  transition('* => *', animate(`350ms ease-in-out`)),
  transition(
    'first => second',
    animate(
      '350ms ease-in-out',
      keyframes([style({ display: 'none', offset: 0 }), style({ display: 'block', offset: 0.2 })]),
    ),
  ),
]);
