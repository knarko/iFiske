import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider, Favorite } from '../../providers/user/user';
import { Area } from '../../providers/area/area';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';

/**
 * Generated class for the AreasFavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-areas-favorites',
  templateUrl: 'areas-favorites.html',
})
export class AreasFavoritesPage {
  private navCtrl: NavController;
  favorites: (Favorite & Area)[];
  static title = 'Favorites';
  static icon = 'star';

  constructor(
    public navParams: NavParams,
    private userProvider: UserProvider,
    private toastCtrl: TranslateToastController,
  ) {
    this.navCtrl = this.navParams.get('rootNavCtrl');
  }

  async ionViewWillEnter() {
    try {
      this.favorites = await this.userProvider.getFavorites();
    } catch (e) {
      // Probably not logged in
    }
  }

  gotoArea(area: Favorite & Area) {
    this.navCtrl.push('AreasDetailPage', area);
  }

  updateNotification(area: Favorite & Area) {
    this.userProvider.setFavoriteNotification(area.ID, area.not)
    .then(() => {
      this.toastCtrl.show({
        message: `Notifications are turned ${area.not ? 'on' : 'off'}`,
        duration: 4000,
      });
    }, err => {
      console.warn(err);
      // TODO: raven
      this.toastCtrl.show({
        message: 'errors.favorite.notification_update',
      });
    });
  }
}
