import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Form } from '../../components/ion-data-form/form';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiError, IFISKE_ERRORS } from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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
    fb: FormBuilder,
  ) {
    this.form = new Form({
      submit: (group: FormGroup) => {
        this.login(group);
      },
      submitMessage: 'Log in',
      errors: {
        network: 'errors.network',
        unknown: 'errors.unknown',
        custom: '',
      },
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
  async login(group: FormGroup) {
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
    this.userProvider
      .login({
        username: group.controls.username.value,
        password: group.controls.password.value,
      })
      .then(
        () => {
          return this.close();
        },
        (error: Error | ApiError) => {
          console.log(this.form);
          if ((error as Error).name === TimeoutError.name) {
            return this.form.group.setErrors({
              network: true,
            });
          }

          const errorCode = error && (error as ApiError).error_code;

          if (errorCode == undefined) {
            return this.form.group.setErrors({
              unknown: true,
            });
          }

          switch (errorCode) {
            case IFISKE_ERRORS.TOO_SHORT_OR_EMPTY_USERNAME:
            case IFISKE_ERRORS.NO_SUCH_USER:
              group.controls.username.setErrors({
                invalid: true,
              });
              break;
            case IFISKE_ERRORS.TOO_SHORT_OR_EMPTY_PASSWORD:
            case IFISKE_ERRORS.USER_EXISTS_BUT_USERNAME_OR_PASSWORD_INCORRECT:
              group.controls.password.setErrors({
                invalid: true,
              });
              break;
            default:
              this.form.group.setErrors({
                custom: true,
              });
              this.form.errors.custom = error && (error as ApiError).response;
              break;
          }
        },
      )
      .catch(() => {})
      .then(() => {
        loading.dismiss();
      });
  }
}
