import { Component, Input } from '@angular/core';

import { Form, FormControl } from './form';

@Component({
  selector: 'ion-data-form',
  templateUrl: './ion-data-form.html',
})
export class IonDataFormComponent {
  @Input() form: Form;
  @Input() hideSubmit = false;
  @Input() disableSubmit: boolean;

  constructor() {}

  submit() {
    this.form.submit();
    return false;
  }

  togglePassword(item: FormControl) {
    item.showPassword = !item.showPassword;
  }

  submitIsDisabled() {
    return this.disableSubmit != undefined
      ? this.disableSubmit
      : !(this.form.group && this.form.group.valid) &&
          this.form.group.hasError('custom');
  }
}
