import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../providers/user/userTypes';
import { DeepLinks, DeepLinksProvider } from '../../providers/deep-links/deep-links';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  numbers: string[];
  user: User;

  constructor(
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private deepLinks: DeepLinksProvider,
  ) {}

  ionViewWillEnter() {
    this.userProvider.getInfo().then(user => (this.user = user));
    this.userProvider.getNumbers().then(numbers => (this.numbers = numbers));
  }

  close() {
    return this.viewCtrl.dismiss();
  }

  async changePassword() {
    this.navCtrl.push('ChangePasswordPage');
  }

  async logout() {
    await this.userProvider.logout();
    return this.close();
  }

  openProfilePage() {
    this.deepLinks.open(DeepLinks.userProfile, {}, { bringSession: true });
  }
}
