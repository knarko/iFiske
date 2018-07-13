import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';

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
    private modalCtrl: ModalController,
  ) {}

  async ionViewWillEnter() {
    this.user = await this.userProvider.getInfo();
  }

  close() {
    return this.viewCtrl.dismiss();
  }

  async changePassword() {
    const modal = this.modalCtrl.create('ChangePasswordPage');
    modal.present();
  }

  async logout() {
    await this.userProvider.logout();
    return this.close();
  }
}
