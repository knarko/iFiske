import { Injectable } from '@angular/core';
import { Pro } from './pro';
import { filter, tap, switchMap, take } from 'rxjs/operators';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { APP_ID } from '../../app/config';
import { SettingsProvider } from '../settings/settings';
import { Platform } from 'ionic-angular';
import { timeout } from 'rxjs/operators/timeout';

@Injectable()
export class DeployProvider {

  constructor(
    private pro: Pro,
    private alertCtrl: TranslateAlertController,
    private settings: SettingsProvider,
    private platform: Platform,
  ) { }

  async initialize() {
    await this.platform.ready();

    await this.pro.deploy.init({
      appId: APP_ID,
      channel: this.settings.channel,
    });
    const versions = this.pro.deploy.getVersions()
    console.log(versions);
    // TODO: remove old versions
    this.checkForUpdates();
  }

  async checkForUpdates() {
    await this.platform.ready();
    console.log(this.pro);

    const hasUpdate = await this.pro.deploy.check().pipe(take(1), timeout(8000)).toPromise();
    console.log(hasUpdate);
    if (hasUpdate === 'true') {
      // TODO: check if we are on wifi
      await this.pro.deploy.download().pipe(
        tap(status => console.log('Download status:', status)),
        filter(status => status === 'true'),
        switchMap(() => this.pro.deploy.extract()),
        tap(status => console.log('Extract status:', status)),
        filter(status => status === 'done'),
        take(1),
      ).toPromise();
      const alert = await this.alertCtrl.show({
        title: 'New update available',
        message: 'There is a new update available',
        buttons: [{
          text: 'Install',
          role: 'install',
        }, {
          text: 'Postpone',
        }],
      });
      return new Promise((resolve) => {
        alert.onDidDismiss((_, role) => {
          if (role === 'install') {
            this.pro.deploy.redirect();
            resolve(true)
          } else {
            resolve(false)
          }
        });
      });
    }
  }

}
