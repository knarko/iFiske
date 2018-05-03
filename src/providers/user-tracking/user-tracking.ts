import { Injectable } from '@angular/core';
import { LaunchReview } from '@ionic-native/launch-review';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { SettingsProvider } from '../settings/settings';

export interface TrackingData {
  appOpened?: number;
  askedForReview?: number;
}
@Injectable()
export class UserTrackingProvider {
  private static readonly STORAGE_LOCATION = 'user_tracking';

  private data: TrackingData = JSON.parse(localStorage.getItem(UserTrackingProvider.STORAGE_LOCATION)) || {};
  constructor(
    private launchReview: LaunchReview,
    private alertCtrl: TranslateAlertController,
    private settings: SettingsProvider,
  ) { }

  private persist() {
    localStorage.setItem(UserTrackingProvider.STORAGE_LOCATION, JSON.stringify(this.data));
  }

  track(key: keyof TrackingData, value: any = 1) {
    switch (key) {
      case 'askedForReview':
      case 'appOpened':
        if (typeof value !== 'number') {
          throw new TypeError(`${value} is not a number`);
        }
        if (this.data[key] == undefined) {
          this.data[key] = 0;
        }
        this.data[key] += value;
        break;
      default:
        throw new Error(`${key} is not trackable`);
    }
    this.persist();
    this.checkForActions(key);
  }

  private checkForActions(key: keyof TrackingData) {
    switch (key) {
      case 'appOpened':
        if (this.data.appOpened > 3 && !this.data.askedForReview) {
          this.askForReview();
        }
        break;
      default:
        break;
    }
  }

  private async askForReview() {
    if (this.settings.language === 'de') {
      return;
    }
    this.alertCtrl.show({
      title: 'ui.reviews.title',
      message: 'ui.reviews.message',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'ui.reviews.no',
        role: 'cancel',
      }, {
        text: 'ui.reviews.yes',
        handler: () => {
          if (this.launchReview.isRatingSupported()) {
            this.launchReview.rating().catch(err => console.warn(err));
          } else {
            this.launchReview.launch().catch(err => console.warn(err));
          }
        },
      }],
    });
    this.track('askedForReview');
  }
}
