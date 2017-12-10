import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
  ) {
  }
  loggedIn() {
    this.navCtrl.setRoot('HomePage');
  }

  skip() {
    this.navCtrl.setRoot('HomePage')
  }

  forgotPassword() {
    this.modalCtrl.create('RecoverPasswordPage').present();
  }

}
