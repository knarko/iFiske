import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms';

import { Form, FormOptions } from '../../components/ion-data-form/form';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { CreateAccountProvider, UserDetails } from '../../providers/create-account/create-account';
import { Observable } from 'rxjs/Observable';
import { map, last, tap } from 'rxjs/operators';
import { validators } from '../../util';
import { IFISKE_ERRORS } from '../../providers/api/api';

@IonicPage({
  defaultHistory: ['HomePage', 'CreateAccountPage'],
})
@Component({
  selector: 'page-create-account-verify',
  templateUrl: 'create-account-verify.html',
})
export class CreateAccountVerifyPage {
  timerCompleted: Observable<boolean>;
  timer: Observable<number>;
  form: Form;
  userDetails: UserDetails;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: TranslateToastController,
    private loadingCtrl: TranslateLoadingController,
    private createAccountProvider: CreateAccountProvider,
  ) {
    this.createAccountProvider.timer.subscribe(timer => {
      this.timer = timer;
      this.timerCompleted = timer.pipe(
        last(),
        tap(console.log),
        map(() => true),
      );
      this.timerCompleted.subscribe(console.log, console.warn, console.error);
    });

    let createUsername = true;
    console.log(this.navParams.get('username'));

    if (this.navParams.get('username')) {
      console.log(true);
      createUsername = false;
    }
    this.createForm(createUsername);
  }

  createForm(username = false) {
    this.userDetails = this.createAccountProvider.getSavedUserDetails();

    const formOptions: FormOptions = {
      submit: async (group: FormGroup) => {
        console.log(group);
        return this.activate(group.value);
      },
      submitMessage: 'Activate',
      errors: {
        invalidRequest: 'errors.activationCode.invalidRequest',
      },
      controls: {
        activationCode: {
          label: 'Activation code',
          placeholder: 'ui.placeholder.activationCode',
          type: 'tel',
          validators: validators.activationCode,
          errors: {
            required: 'errors.activationCode.required',
            pattern: 'errors.activationCode.pattern',
          },
        },
      },
    };
    if (username) {
      formOptions.controls = {
        username: {
          label: 'Username',
          placeholder: 'ui.placeholder.username',
          validators: validators.username,
          errors: {
            required: 'errors.username.required',
          },
        },
        activationCode: formOptions.controls.activationCode,
      };
    }

    this.form = new Form(formOptions);

    if (username) {
      this.form.controls.username.control.setValue(this.userDetails.username || '');
    }
  }

  async activate(userDetails: { username?: string; activationCode: string }) {
    const loading = await this.loadingCtrl.show({ content: 'Activating' });
    try {
      const didLogIn = await this.createAccountProvider.activate(userDetails);
      this.toastCtrl.show({
        message: 'Account created',
        duration: 4000,
      });

      if (didLogIn) {
        this.dismissModal();
      } else {
        this.navCtrl.popTo('LoginPage');
      }
    } catch (err) {
      console.warn(err);

      const errorCode = err && err.error_code;
      this.form.group.setErrors({
        invalidRequest: true,
      });

      switch (errorCode) {
        case IFISKE_ERRORS.USER_CONFIRM_INVALID_PIN:
          this.form.group.controls.activationCode.setErrors({ pattern: true });
          break;
        case IFISKE_ERRORS.USER_CONFIRM_NO_SUCH_USERNAME_PIN_COMBO:
          this.createForm(true);
          break;
        default:
          this.form.setCustomError(err && err.response);
      }

      if (err.message === 'No username') {
        return;
      }
    } finally {
      loading.dismiss();
    }
  }

  dismissModal() {
    const firstViewCtrl = this.navCtrl.first();
    this.navCtrl.remove(firstViewCtrl.index, this.navCtrl.length()).then(() => {
      firstViewCtrl.dismiss(undefined, undefined, { animate: false });
    });
  }

  retry() {
    return this.createAccountProvider
      .retry()
      .then(() => {
        this.toastCtrl.show({
          message: 'Activation code resent',
          duration: 4000,
        });
      })
      .catch(() => {
        this.toastCtrl.show({
          message: 'Activation code failed',
          duration: 6000,
        });
      });
  }
}
