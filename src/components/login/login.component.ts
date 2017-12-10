import { Component, EventEmitter, Output } from '@angular/core';
import { UserProvider } from '../../providers/user/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { Form } from '../ion-data-form/form';
import { ApiError } from '../../providers/api/api';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  form: Form;
  @Output() loggedIn = new EventEmitter<void>();

  constructor(
    private userProvider: UserProvider,
    private loadingCtrl: TranslateLoadingController,
    fb: FormBuilder,
  ) {
    this.form = new Form({
      submit: (group: FormGroup) => {
        this.login(group);
      },
      submitMessage: 'Log in',
      errors: {},
      controls: {
        username: {
          placeholder: 'Username',
          type: 'text',
          validators: [Validators.required],
          errors: {
            required: 'errors.username.required',
            invalid: 'errors.username.invalid',
          },
        },
        password: {
          placeholder: 'Password',
          type: 'password',
          validators: [Validators.required],
          errors: {
            required: 'errors.password.required',
            invalid: 'errors.password.invalid',
          },
        },
      },
    });
  }

  /**
  * login
  * Submit handler for login form. Validates login input.
  * Moves to home view on successful login.
  */
  async login(group: FormGroup) {
    if (!group.valid) {
      for (const control of [group, group.controls.username, group.controls.password]) {
        control.markAsDirty();
        control.markAsTouched();
      }
      return;
    }
    const loading = await this.loadingCtrl.create({
      content: 'Logging in',
    });
    loading.present();
    // TODO: show loading spinner
    this.userProvider.login({
      username: group.controls.username.value,
      password: group.controls.password.value,
    })
      .then(() => {
        this.loggedIn.emit()
      }, (error: ApiError) => {

        switch (error.error_code) {
          case 2:
          case 5:
            group.controls.username.setErrors({
              invalid: true,
            });
            break;
          case 3:
          case 4:
            group.controls.password.setErrors({
              invalid: true,
            });
            break;
          default:
            this.form.group.setErrors({
              loginFailed: true,
            });
            this.form.errors.loginFailed = error.response;
            break;
        }
      }).catch().then(() => {
        loading.dismiss();
      });
  }

}
