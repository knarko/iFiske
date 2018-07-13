import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UserProvider, Favorite } from '../../providers/user/user';
import { Area } from '../../providers/area/area';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { MonitoringClient } from '../../app/monitoring';

@IonicPage()
@Component({
  selector: 'page-areas-favorites',
  templateUrl: 'areas-favorites.html',
})
export class AreasFavoritesPage {
  favorites: (Favorite & Area)[];
  static title = 'Favorites';
  static icon = 'star';
  loggedIn = this.userProvider.loggedIn;

  constructor(
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private toastCtrl: TranslateToastController,
  ) {}

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
    this.userProvider.setFavoriteNotification(area.ID, area.not).then(
      () => {
        this.toastCtrl.show({
          message: `Notifications are turned ${area.not ? 'on' : 'off'}`,
          duration: 4000,
        });
      },
      err => {
        console.warn(err);
        MonitoringClient.captureException(err);
        this.toastCtrl.show({
          message: 'errors.favorite.notification_update',
          duration: 4000,
        });
      },
    );
  }
}
