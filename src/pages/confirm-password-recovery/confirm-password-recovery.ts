import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { TranslateService } from '@ngx-translate/core';
import { Form } from '../../components/ion-data-form/form';

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
    methods:string[];
  };

  form: Form;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private toastCtrl: TranslateToastController,
    private loadingCtrl: TranslateLoadingController,
    private translate: TranslateService,
    fb: FormBuilder,
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
          validators: [
            Validators.required,
          ],
          errors: {
            required: 'errors.username.required',
            invalid: 'User does not exist',
          },
        },
        code: {
          label: 'Recovery code',
          placeholder: 'ui.placeholder.recovery_code',
          type: 'text',
          validators: [
            Validators.required,
          ],
          errors: {
            required: 'errors.recovery_code.required',
            invalid: 'errors.recovery_code.invalid',
          },
        },
        password: {
          label: 'New password',
          placeholder: 'ui.placeholder.password',
          type: 'password',
          validators: [
            Validators.required,
          ],
          errors: {
            required:' errors.password.required',
            invalid: 'errors.password.invalid',
          },
        },
      },
    });
  }

  async ionViewWillLoad() {
    this.form.controls.username.control.setValue(this.navParams.data.username);
    const methods = this.navParams.data.methods;
    if (methods) {
      this.codeSentVia = {
        mailed: !!methods.mailed,
        texted: !!methods.texted,
        methods: [
          methods.mailed ? 'Email' : '',
          methods.texted ? 'SMS' : '',
        ].filter(x => !!x),
      }
    } else {
      this.codeSentVia = undefined;
    }
  }

  async resetPassword(group: FormGroup) {
    const loading = await this.loadingCtrl.create({
      content: 'Resetting password',
    });
    loading.present();
    this.userProvider.resetPassword({
      username: group.controls.username.value,
      code: group.controls.code.value,
      password: group.controls.password.value,
    }).then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'Password changed',
        duration: 4000,
      });
      toast.present();
      this.navCtrl.popToRoot();
      this.navCtrl.first().dismiss();
    }, async (error) => {
      switch (error.error_code) {
      case 5:
        // invalid username
        this.form.controls.username.control.setErrors({
          invalid: true,
        });
        break;
      case 13:
        this.form.controls.password.control.setErrors({
          minLength: true,
        });
        break;
      case 16:
        this.form.controls.code.control.setErrors({
          invalid: true,
        });
        break;
      default:
        console.warn('Unhandled error code from api', error);
        const toast = await this.toastCtrl.create({
          message: 'Unhandled API error',
          duration: 6000,
        })
        toast.present();
        break;
      }
    }).catch().then(() => {
      loading.dismiss();
    })
  }
}
