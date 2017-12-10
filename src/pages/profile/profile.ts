import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;

  constructor(private userProvider: UserProvider, private viewCtrl: ViewController) {
  }

  async ionViewWillEnter() {
    this.user = await this.userProvider.getInfo()
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
