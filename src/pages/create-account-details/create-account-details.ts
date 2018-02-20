import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operators';

import { ApiProvider } from '../../providers/api/api';
import { Form } from '../../components/ion-data-form/form';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { UserDetails, CreateAccountProvider } from '../../providers/create-account/create-account';


@IonicPage({
  defaultHistory: ['HomePage', 'CreateAccountPage'],
})
@Component({
  selector: 'page-create-account-details',
  templateUrl: 'create-account-details.html',
})
export class CreateAccountDetailsPage {
  form: Form;

  validateUsername: AsyncValidatorFn = (c: AbstractControl) => {
    return timer(500).pipe(
      switchMap(() => {
        return this.API.user_exists(c.value).then(res => {
          return res ? { taken: true } : null;
        });
      }),
    );
  };
  validateEmail: AsyncValidatorFn = (c: AbstractControl) => {
    return timer(500).pipe(
      switchMap(() => {
        return this.API.user_exists(undefined, c.value).then(res => {
          return res ? { taken: true } : null;
        });
      }),
    );
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private API: ApiProvider,
    private loadingCtrl: TranslateLoadingController,
    private createAccountProvider: CreateAccountProvider,
  ) {
    this.form = new Form({
      submit: (group: FormGroup) => {
        console.log(group);
        this.submit(group.value);
      },
      submitMessage: 'Continue',
      errors: {
        register: 'errors.register.failed',
      },
      controls: {
        username: {
          label: 'Username',
          placeholder: 'ui.placeholder.username',
          type: 'text',
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
          ],
          asyncValidators: [
            this.validateUsername,
          ],
          errors: {
            required: 'errors.username.required',
            taken: 'errors.username.taken',
            minlength: 'errors.username.pattern_mismatch',
            maxlength: 'errors.username.pattern_mismatch',
          },
        },
        password: {
          label: 'Password',
          placeholder: 'ui.placeholder.password',
          type: 'password',
          validators: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(16),
          ],
          errors: {
            required: 'errors.password.required',
            minlength: 'errors.password.pattern_mismatch',
            maxlength: 'errors.password.pattern_mismatch',
          },
        },
        fullname: {
          label: 'Full name',
          placeholder: 'ui.placeholder.fullname',
          type: 'text',
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
          ],
          errors: {
            required: 'errors.fullname.required',
            minlength: 'errors.fullname.pattern_mismatch',
            maxlength: 'errors.fullname.pattern_mismatch',
          },
        },
        email: {
          label: 'Email',
          placeholder: 'ui.placeholder.email',
          type: 'email',
          validators: [
            Validators.required,
            Validators.email,
          ],
          asyncValidators: [
            this.validateEmail,
          ],
          errors: {
            required: 'errors.email.required',
            email: 'errors.email.invalid',
            taken: 'errors.email.taken',
          },
        },
        phone: {
          label: 'Phone number',
          placeholder: 'ui.placeholder.phone',
          type: 'tel',
          validators: [
            Validators.required,
            Validators.pattern(/^\+?[\d\-\s\(\)]{5,25}$/),
          ],
          errors: {
            required: 'errors.phone.required',
            invalid: 'errors.phone.invalid',
            pattern: 'errors.phone.pattern',
          },
        },
      },
    });
  }

  async submit(userDetails: UserDetails) {
    const loading = await this.loadingCtrl.show({
      content: 'Registering',
    });
    try {
      await this.createAccountProvider.register(userDetails);
      this.form.group.reset();
      return this.navCtrl.push('CreateAccountVerifyPage', {username: userDetails.username});
    } catch (err) {
      this.form.group.setErrors({ register: true });
      const { email, username, phone } = this.form.group.controls;
      switch (err.error_code) {
        case 8:
          email.setErrors({ invalid: true });
          break;
        case 9:
          username.updateValueAndValidity();
          email.updateValueAndValidity();
          break;
        case 10:
          phone.setErrors({ invalid: true })
          break;
      }
    } finally {
      loading.dismiss();
    }
  }
}
