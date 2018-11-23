import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operators';

import { ApiProvider, IFISKE_ERRORS } from '../../providers/api/api';
import { Form } from '../../components/ion-data-form/form';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { UserDetails, CreateAccountProvider } from '../../providers/create-account/create-account';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import { TermsProvider } from '../../providers/terms/terms';
import { validators } from '../../util';

@IonicPage({
  defaultHistory: ['HomePage', 'CreateAccountPage'],
})
@Component({
  selector: 'page-create-account-details',
  templateUrl: 'create-account-details.html',
})
export class CreateAccountDetailsPage {
  acceptedTos: boolean;
  form: Form;

  validateUsername: AsyncValidatorFn = (c: AbstractControl) => {
    return timer(500).pipe(
      switchMap(() => {
        return this.API.user_exists(c.value)
          .then(res => {
            return res ? { taken: true } : null;
          })
          .catch(() => ({ network: true }));
      }),
    );
  };
  validateEmail: AsyncValidatorFn = (c: AbstractControl) => {
    return timer(500).pipe(
      switchMap(() => {
        return this.API.user_exists(undefined, c.value)
          .then(res => {
            return res ? { taken: true } : null;
          })
          .catch(() => ({ network: true }));
      }),
    );
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private API: ApiProvider,
    private loadingCtrl: TranslateLoadingController,
    private createAccountProvider: CreateAccountProvider,
    private alertCtrl: TranslateAlertController,
    private termsProvider: TermsProvider,
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
          validators: validators.username,
          asyncValidators: [this.validateUsername],
          errors: {
            required: 'errors.username.required',
            taken: 'errors.username.taken',
            minlength: 'errors.username.pattern_mismatch',
            maxlength: 'errors.username.pattern_mismatch',
            network: 'errors.network',
          },
        },
        password: {
          label: 'Password',
          placeholder: 'ui.placeholder.password',
          type: 'password',
          validators: validators.password,
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
          validators: validators.fullname,
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
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.validateEmail],
          errors: {
            required: 'errors.email.required',
            email: 'errors.email.invalid',
            taken: 'errors.email.taken',
            network: 'errors.network',
          },
        },
        phone: {
          label: 'Phone number',
          placeholder: 'ui.placeholder.phone',
          type: 'tel',
          validators: validators.phone,
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
      return this.navCtrl.push('CreateAccountVerifyPage', { username: userDetails.username });
    } catch (err) {
      this.form.group.setErrors({ register: true });
      const { email, username, phone } = this.form.group.controls;
      switch (err.error_code) {
        case IFISKE_ERRORS.USER_CREATION_INVALID_EMAIL:
          email.setErrors({ invalid: true });
          break;
        case IFISKE_ERRORS.USER_CREATION_USERNAME_OR_EMAIL_EXISTS:
          username.updateValueAndValidity();
          email.updateValueAndValidity();
          break;
        case IFISKE_ERRORS.USER_CREATION_INVALID_PHONE:
          phone.setErrors({ invalid: true });
          break;
      }
    } finally {
      loading.dismiss();
    }
  }

  async persistApproval() {
    if (this.acceptedTos) {
      const alert = await this.alertCtrl.show(
        {
          cssClass: 'alert-large alert-terms',
          message: this.termsProvider.termsOfService,
          title: 'Terms of service',
          buttons: [
            {
              text: 'Cancel',
            },
            {
              text: 'Accept',
              role: 'accept',
            },
          ],
        },
        ['title'],
      );
      const role = await new Promise(resolve => {
        alert.onDidDismiss((_, role) => resolve(role));
      });
      if (role !== 'accept') {
        this.acceptedTos = false;
      }
    }
  }
}
