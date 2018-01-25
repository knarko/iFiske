import { Injectable } from '@angular/core';
import { Pro } from './pro';
import { filter, tap, switchMap, take, timeout } from 'rxjs/operators';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { APP_ID } from '../../app/config';
import { SettingsProvider } from '../settings/settings';
import { Platform } from 'ionic-angular';

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
    const deploy = await this.pro.deploy();

    await deploy.init({
      appId: APP_ID,
      channel: this.settings.channel,
    });
    const versions = deploy.getVersions()
    console.log(versions);
    // TODO: remove old versions
    this.checkForUpdates();
  }

  async setChannel(channel: string) {
    await this.platform.ready();
    const deploy = await this.pro.deploy();

    this.settings.channel = channel;
    return deploy.init({
      appId: APP_ID,
      channel,
    });
  }

  async checkForUpdates() {
    await this.platform.ready();
    console.log(this.pro);

    const hasUpdate = await Promise.race([
      this.pro.deploy().then(deploy => deploy.check()),
      new Promise((_, reject) => setTimeout(reject, 8000)),
    ]);
    console.log(hasUpdate);
    if (hasUpdate === 'true') {
      // TODO: check if we are on wifi
      const deploy = await this.pro.deploy();
      await deploy.download().pipe(
        tap(status => console.log('Download status:', status)),
        filter(status => status === 'true' || status === 'done'),
        switchMap(() => deploy.extract()),
        tap(status => console.log('Extract status:', status)),
        filter(status => status === 'true' || status === 'done'),
        take(1),
        timeout(30 * 1000),
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
            deploy.redirect();
            resolve(true)
          } else {
            resolve(false)
          }
        });
      });
    }
  }

}
