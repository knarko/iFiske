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
  user: User;

  constructor(
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private deepLinks: DeepLinksProvider,
  ) {}

  async ionViewWillEnter() {
    this.user = await this.userProvider.getInfo();
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
    this.deepLinks.open(DeepLinks.profile, { baseUrl: this.user.profile }, { bringSession: true });
  }
  openMyPage() {
    this.deepLinks.open(DeepLinks.myPage, { baseUrl: this.user.mypage }, { bringSession: true });
  }
}
