import {
  Component,
  Input,
} from '@angular/core';

import { Form } from './form';

@Component({
  selector: 'ion-data-form',
  templateUrl: './ion-data-form.html',
})
export class IonDataFormComponent {
  @Input() form: Form;
  @Input() hideSubmit = false;

  constructor() { }

  submit() {
    this.form.submit();
    return false;
  }
}
