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

const hide = { visibility: 'hidden', display: 'none' };
const show = { visibility: 'visible', display: 'block' };
export const flipFront = trigger('showFront', [
  state('first', style({ transform: `rotateY(360deg)`, display: 'block' })),
  state('second', style({ transform: `rotateY(180deg)`, display: 'none' })),
  transition(':enter', animate(0)),
  transition(
    'first => second',
    animate(
      '350ms ease-in-out',
      keyframes([
        style({ transform: 'rotateY(360deg)', offset: 0, ...show }),
        style({ transform: 'rotateY(270deg)', offset: 0.49999, ...show }),
        style({ transform: 'rotateY(270deg)', offset: 0.50001, ...hide }),
        style({ transform: 'rotateY(180deg)', offset: 1, ...hide }),
      ]),
    ),
  ),
  transition(
    'second => first',
    animate(
      '350ms ease-in-out',
      keyframes([
        style({ transform: 'rotateY(180deg)', offset: 0, ...hide }),
        style({ transform: 'rotateY(270deg)', offset: 0.49999, ...hide }),
        style({ transform: 'rotateY(270deg)', offset: 0.50001, ...show }),
        style({ transform: 'rotateY(360deg)', offset: 1, ...show }),
      ]),
    ),
  ),
]);

export const flipBack = trigger('showBack', [
  state('first', style({ transform: `rotateY(180deg)`, display: 'none' })),
  state('second', style({ transform: `rotateY(0deg)`, display: 'block' })),
  transition(':enter', animate(0)),
  transition(
    'second => first',
    animate(
      '350ms ease-in-out',
      keyframes([
        style({ transform: 'rotateY(0deg)', offset: 0, ...show }),
        style({ transform: 'rotateY(90deg)', offset: 0.49999, ...show }),
        style({ transform: 'rotateY(90deg)', offset: 0.50001, ...hide }),
        style({ transform: 'rotateY(180deg)', offset: 1, ...hide }),
      ]),
    ),
  ),
  transition(
    'first => second',
    animate(
      '350ms ease-in-out',
      keyframes([
        style({ transform: 'rotateY(180deg)', offset: 0, ...hide }),
        style({ transform: 'rotateY(90deg)', offset: 0.49999, ...hide }),
        style({ transform: 'rotateY(90deg)', offset: 0.50001, ...show }),
        style({ transform: 'rotateY(0deg)', offset: 1, ...show }),
      ]),
    ),
  ),
]);
