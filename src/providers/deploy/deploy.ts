import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Pro } from '@ionic-native/pro';
import { filter, tap, switchMap, take, timeout } from 'rxjs/operators';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { APP_ID } from '../../app/config';
import { SettingsProvider } from '../settings/settings';
import { Platform } from 'ionic-angular';

export enum Connection {
  UNKNOWN = 'unknown',
  ETHERNET = 'ethernet',
  WIFI = 'wifi',
  CELL_2G = '2g',
  CELL_3G = '3g',
  CELL_4G = '4g',
  CELL = 'cellular',
  NONE = 'none',
}

@Injectable()
export class DeployProvider {
  checking: boolean;

  constructor(
    private pro: Pro,
    private alertCtrl: TranslateAlertController,
    private settings: SettingsProvider,
    private platform: Platform,
    private network: Network,
  ) {}

  async hasDeploy() {
    if (!this.pro.deploy()) {
      throw new Error('Deploy not loaded');
    }
  }

  async initialize() {
    await this.platform.ready();
    await this.hasDeploy();

    await this.pro.deploy().init({
      appId: APP_ID,
      channel: this.settings.channel,
    });
    const versions = this.pro.deploy().getVersions();
    console.log(versions);
    // TODO: remove old versions
    this.platform.resume.subscribe(() => {
      this.checkForUpdates();
    });
    this.checkForUpdates();
  }

  async setChannel(channel: string) {
    await this.platform.ready();
    this.settings.channel = channel;

    await this.hasDeploy();

    return this.pro.deploy().init({
      appId: APP_ID,
      channel,
    });
  }

  async checkForUpdates() {
    if (this.checking) {
      return;
    } else {
      this.checking = true;
    }

    try {
      await this.platform.ready();
      await this.hasDeploy();

      const hasUpdate = await Promise.race([
        this.pro.deploy().check(),
        new Promise((_, reject) => setTimeout(reject, 8000)),
      ]);

      console.log(hasUpdate);
      if (hasUpdate !== 'true') {
        return false;
      }

      switch (this.network.type) {
        // Don't update if the network type is slow (it probably costs a little bit)
        case Connection.CELL:
        case Connection.CELL_2G:
        case Connection.CELL_3G:
        case Connection.UNKNOWN:
        case Connection.NONE:
          this.network
            .onchange()
            .pipe(take(1))
            .subscribe(() => {
              this.checkForUpdates();
            });
          return false;

        case Connection.WIFI:
        case Connection.CELL_4G:
        default:
          break;
      }

      await this.pro
        .deploy()
        .download()
        .pipe(
          tap(status => console.log('Download status:', status)),
          filter(status => status === 'true' || status === 'done'),
          switchMap(() => this.pro.deploy().extract()),
          tap(status => console.log('Extract status:', status)),
          filter(status => status === 'true' || status === 'done'),
          take(1),
          timeout(30 * 1000),
        )
        .toPromise();

      if (this.settings.isDeveloper) {
        const alert = await this.alertCtrl.show({
          title: 'New update available',
          message: 'There is a new update available',
          buttons: [
            {
              text: 'Install',
              role: 'install',
            },
            {
              text: 'Postpone',
              role: 'cancel',
            },
          ],
        });

        return new Promise(resolve => {
          alert.onDidDismiss((_, role) => {
            if (role === 'install') {
              this.pro.deploy().redirect();
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }
      return false;
    } finally {
      this.checking = false;
    }
  }
}
