import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Form } from '../../components/ion-data-form/form';
import { Validators } from '@angular/forms';
import { ApiError, IFISKE_ERRORS } from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { StatusBar } from '@ionic-native/status-bar';
import { TimeoutError } from '../../errors';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form: Form;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private loadingCtrl: TranslateLoadingController,
    private viewCtrl: ViewController,
    private statusBar: StatusBar,
  ) {
    this.form = new Form({
      submit: () => this.login(),
      submitMessage: 'Log in',
      errors: {
        network: 'errors.network',
        unknown: 'errors.unknown',
        custom: '',
      },
      controls: {
        username: {
          placeholder: 'Username or email',
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

  ionViewDidEnter() {
    this.statusBar.styleDefault();
  }

  ionViewWillLeave() {
    this.statusBar.styleBlackTranslucent();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  forgotPassword() {
    this.navCtrl.push('RecoverPasswordPage');
  }

  createAccount() {
    this.navCtrl.push('CreateAccountPage');
  }

  /**
   * login
   * Submit handler for login form. Validates login input.
   * Moves to home view on successful login.
   */
  async login() {
    const group = this.form.group;
    if (!group.valid) {
      for (const control of [group, group.controls.username, group.controls.password]) {
        control.markAsDirty();
        control.markAsTouched();
      }
      if (!group.controls.username.valid || !group.controls.password.valid) {
        return;
      }
    }
    const loading = await this.loadingCtrl.show({
      content: 'Logging in',
    });
    loading.present();
    try {
      await this.userProvider.login({
        username: group.controls.username.value,
        password: group.controls.password.value,
      });
      return this.close();
    } catch (error) {
      this.handleError(error);
    } finally {
      loading.dismiss();
    }
  }

  handleError(error?: Error | ApiError) {
    console.log(this.form);
    if ((error as Error).name === TimeoutError.name) {
      this.form.group.setErrors({
        network: true,
      });
      return;
    }

    const errorCode = error && (error as ApiError).error_code;

    switch (errorCode) {
      case IFISKE_ERRORS.TOO_SHORT_OR_EMPTY_USERNAME:
      case IFISKE_ERRORS.NO_SUCH_USER:
        this.form.group.controls.username.setErrors({
          invalid: true,
        });
        break;
      case IFISKE_ERRORS.TOO_SHORT_OR_EMPTY_PASSWORD:
      case IFISKE_ERRORS.USER_EXISTS_BUT_USERNAME_OR_PASSWORD_INCORRECT:
        this.form.group.controls.password.setErrors({
          invalid: true,
        });
        break;
      default:
        console.log(error, errorCode);
        if (errorCode === undefined) {
          this.form.setCustomError(error && (error as ApiError).response, {
            unknown: true,
          });
        } else {
          this.form.setCustomError(error && (error as ApiError).response);
        }
        break;
    }
  }
}
