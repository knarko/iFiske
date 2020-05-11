import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../providers/user/userTypes';
import {
  DeepLinks,
  DeepLinksProvider,
} from '../../providers/deep-links/deep-links';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  numbers: string[];
  user: User;
  deliveryAddress = {};

  addressHasChanged = false;

  constructor(
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private deepLinks: DeepLinksProvider,
  ) {}

  ionViewWillEnter() {
    this.userProvider.getInfo().then((user) => (this.user = user));
    this.userProvider.getNumbers().then((numbers) => (this.numbers = numbers));
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

  addressChanged(key, val) {
    console.log(key, val);
    if (this.user[key] === val) {
      delete this.deliveryAddress[key];
    } else {
      this.deliveryAddress[key] = val;
    }
    this.addressHasChanged = !!Object.keys(this.deliveryAddress).length;
  }

  async saveAddress() {
    this.addressHasChanged = false;
    const { town, adr, zip } = this.user;
    const update = Object.assign({ town, adr, zip }, this.deliveryAddress);
    await this.userProvider.setDeliveryAddress(update);
  }
}
