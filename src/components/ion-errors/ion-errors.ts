import { Component, Input, HostBinding } from '@angular/core';
import { Dictionary } from '../../types';
import { AbstractControl } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ion-errors',
  templateUrl: 'ion-errors.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('errors', [
      transition(':enter', [
        style({ transform: 'scaleY(0)', opacity: 0, height: 0 }),
        animate('150ms ease-in-out', style({ transform: 'scaleY(1)', opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        style({ transform: 'scaleY(1)', opacity: 1, height: '*' }),
        animate('150ms ease-in-out', style({ transform: 'scaleY(0)', opacity: 0, height: 0 })),
      ]),
    ]),
  ],
})
export class IonErrorsComponent {
  @Input() errors: Dictionary<string>;
  @Input() control: AbstractControl;
  @HostBinding('class.empty')
  get empty() {
    if (this.control && this.control.invalid && this.control.dirty && this.errors && this.control.errors) {
      return false;
    }
    return true;
  }
  constructor() {}
}
