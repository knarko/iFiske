import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Form } from '../../components/ion-data-form/form';
import { FormGroup } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { validators } from '../../util';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  form: Form;
  constructor(
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
    private toastCtrl: TranslateToastController,
  ) {
    this.form = new Form({
      submit: (group: FormGroup) => {
        this.userProvider.changePassword(group.value).then(
          () => {
            this.viewCtrl.dismiss();
            this.toastCtrl.show({ duration: 4000, message: 'ui.changePassword.completed' });
          },
          err => {
            const errorCode = err.message && err.message.error_code;
            switch (errorCode) {
              case 4:
                this.form.group.controls.oldPassword.setErrors({ invalid: true });
                break;
              default:
            }
          },
        );
      },
      submitMessage: 'Change Password',
      controls: {
        oldPassword: {
          label: 'Password',
          type: 'password',
          validators: validators.password,
          errors: {
            invalid: 'errors.password.invalid',
            required: 'errors.password.required',
            minlength: 'errors.password.pattern_mismatch',
            maxlength: 'errors.password.pattern_mismatch',
          },
        },
        newPassword: {
          label: 'New Password',
          type: 'password',
          validators: validators.password,
          errors: {
            required: 'errors.password.required',
            minlength: 'errors.password.pattern_mismatch',
            maxlength: 'errors.password.pattern_mismatch',
          },
        },
      },
    });
  }
}
