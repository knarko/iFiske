import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Validators, FormGroup } from '@angular/forms';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { Form } from '../../components/ion-data-form/form';
import { IFISKE_ERRORS } from '../../providers/api/api';
import { validators } from '../../util';

/**
 * Generated class for the ConfirmPasswordRecoveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-password-recovery',
  templateUrl: 'confirm-password-recovery.html',
})
export class ConfirmPasswordRecoveryPage {
  codeSentVia: {
    mailed: boolean;
    texted: boolean;
    methods: string[];
  };

  form: Form;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private toastCtrl: TranslateToastController,
    private loadingCtrl: TranslateLoadingController,
  ) {
    this.form = new Form({
      submit: (group: FormGroup) => {
        this.resetPassword(group);
      },
      submitMessage: 'Recover password',
      controls: {
        username: {
          label: 'Username or email',
          placeholder: 'ui.placeholder.email',
          type: 'text',
          validators: [Validators.required],
          errors: {
            required: 'errors.username.required',
            invalid: 'User does not exist',
          },
        },
        code: {
          label: 'Recovery code',
          placeholder: 'ui.placeholder.recovery_code',
          type: 'text',
          validators: [Validators.required],
          errors: {
            required: 'errors.recovery_code.required',
            invalid: 'errors.recovery_code.invalid',
          },
        },
        password: {
          label: 'New password',
          type: 'password',
          validators: validators.password,
          errors: {
            required: 'errors.password.required',
            invalid: 'errors.password.invalid',
            minlength: 'errors.password.pattern_mismatch',
            maxlength: 'errors.password.pattern_mismatch',
          },
        },
      },
    });
  }

  async ionViewWillEnter() {
    this.form.controls.username.control.setValue(this.navParams.data.username);
    const methods = this.navParams.data.methods;
    if (methods) {
      this.codeSentVia = {
        mailed: !!methods.mailed,
        texted: !!methods.texted,
        methods: [methods.mailed ? 'Email' : '', methods.texted ? 'SMS' : ''].filter(x => !!x),
      };
    } else {
      this.codeSentVia = undefined;
    }
  }

  async resetPassword(group: FormGroup) {
    const loading = await this.loadingCtrl.show({
      content: 'Changing password',
    });
    this.userProvider
      .resetPassword({
        username: group.controls.username.value,
        code: group.controls.code.value,
        password: group.controls.password.value,
      })
      .then(
        async () => {
          this.toastCtrl.show({
            message: 'Password changed',
            duration: 4000,
          });
          this.navCtrl.popToRoot();
          this.navCtrl.first().dismiss();
        },
        async error => {
          switch (error.error_code) {
            case IFISKE_ERRORS.NO_SUCH_USER:
              this.form.controls.username.control.setErrors({
                invalid: true,
              });
              break;
            case IFISKE_ERRORS.USER_CREATION_USERNAME_LENGTH:
              this.form.controls.password.control.setErrors({
                minLength: true,
              });
              break;
            case IFISKE_ERRORS.PASSWORD_CHANGE_INVALID_RESET_CODE:
              this.form.controls.code.control.setErrors({
                invalid: true,
              });
              break;
            default:
              this.form.setCustomError(error && error.response);
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
