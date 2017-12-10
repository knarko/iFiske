import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {
  username: string;

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private API: ApiProvider,
  ) { }

  async next(username: string) {
    let methods;

    if (username) {
      try {
        methods = await this.API.user_lost_password(username)
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    this.navCtrl.push('ConfirmPasswordRecoveryPage', {
      username,
      methods,
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
