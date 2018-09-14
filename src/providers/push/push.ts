import { Injectable } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { SettingsProvider } from '../settings/settings';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { Dictionary, Overwrite } from '../../types';
import { ApiProvider } from '../api/api';
import { OneSignal, OSNotificationOpenedResult, OSNotificationPayload } from '@ionic-native/onesignal';
import { oneSignalConfig } from '../../app/config';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../providers/user/userTypes';
import { DeepLinks, DeepLinksProvider } from '../deep-links/deep-links';

interface IfiskeNotification {
  action?: string;
  message?: string;
  code?: string;
  orgid?: number;
  repid?: number;
}

export interface PushHandler {
  (notification: Overwrite<OSNotificationPayload, { additionalData: IfiskeNotification }>): Promise<void> | void;
}

@Injectable()
export class PushProvider {
  private user: User;
  private static readonly TAGS = ['marketing', 'developer', 'user_id', 'username', 'email'];

  token: string;
  private defaultHandler: PushHandler = notification => {
    this.alertCtrl.show({
      message: notification.additionalData.message,
    });
  };

  private pushHandlers: Dictionary<PushHandler[]> = {
    /*
      * We got a new fishing permit. We will get the Code of the new permit
      * Payload should contain:
      * code: fishing permit code
      */
    NEW: [
      notification => {
        if (notification.additionalData.code) {
          const navCtrl = this.app.getRootNavs()[0];
          if (!navCtrl) {
            return;
          }
          navCtrl.push('PermitDetailPage', { ID: notification.additionalData.code });
        }
      },
    ],

    /*
      * We got a request to make a fishing report
      * Payload should contain:
      * orgid: organisation id,
      * code: fishing permit code,
      */
    REP_REQ: [
      notification => {
        if (notification.additionalData.orgid && notification.additionalData.code) {
          this.alertCtrl.show({
            title: 'Do you want to create a catch report?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'OK',
                handler: () => {
                  this.deepLinks.open(
                    DeepLinks.catchReport,
                    { code: notification.additionalData.code },
                    { bringSession: true },
                  );
                },
              },
            ],
          });
        }
      },
    ],

    /*
      * Someone made a report on a area we favorited
      * Payload should contain:
      * RepId: ID of the new report
      */
    NEW_FAV: [
      notification => {
        if (notification.additionalData.repid) {
          // this.navCtrl.push('app.report', {id: notification.repid});
        }
      },
    ],

    /*
      * Display a message
      * Payload should contain:
      * message: a string that we should Display
      */
    NOTE: [
      notification => {
        if (notification.additionalData.message) {
          this.alertCtrl.show({
            title: notification.title,
            message: notification.additionalData.message,
          });
        }
      },
    ],
  };

  constructor(
    private app: App,
    private API: ApiProvider,
    private alertCtrl: TranslateAlertController,
    private settings: SettingsProvider,
    private oneSignal: OneSignal,
    private plt: Platform,
    private deepLinks: DeepLinksProvider,
    private userProvider: UserProvider,
  ) {
    this.plt.ready().then(() => {
      this.oneSignal.startInit(oneSignalConfig.appId, oneSignalConfig.googleProjectNumber);

      this.oneSignal.iOSSettings({
        kOSSettingsKeyAutoPrompt: false,
        kOSSettingsKeyInAppLaunchURL: false,
      });

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe(this.onReceived);
      this.oneSignal.handleNotificationOpened().subscribe(this.onOpened);

      this.oneSignal.endInit();

      this.settings.settingsChanged.subscribe(settings => {
        this.oneSignal.setSubscription(settings.push);
      });
    });
    this.userProvider.loggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        this.register();
        this.userProvider.getInfo().then(data => {
          this.setUserDetails(data);
        });
      } else {
        this.unregister();
      }
    });
  }

  async register() {
    if (this.token) {
      this.unregister();
    }

    const { permissionStatus } = await this.oneSignal.getPermissionSubscriptionState();
    if (!permissionStatus.hasPrompted || permissionStatus.status === 0) {
      const accepted = await this.oneSignal.promptForPushNotificationsWithUserResponse();
      if (!accepted) {
        return;
      }
    }

    const { pushToken } = await this.oneSignal.getIds();

    this.token = pushToken;

    // TODO: remove? It's not needed with the current implementation
    this.API.user_set_pushtoken(this.token);

    // TODO: handle subscriptions to topics better, allow opt-out and such
    const tags: any = {};

    if (this.settings.isDeveloper) {
      tags.developer = true;
    }

    if (this.user) {
      tags.username = this.user.username;
    }

    tags.marketing = true;

    this.oneSignal.sendTags(tags);
  }

  unregister() {
    this.token = undefined;
    this.user = undefined;
    this.oneSignal.deleteTags(PushProvider.TAGS);
  }

  setUserDetails(user: User) {
    this.user = user;
    this.oneSignal.sendTags({
      // email: user.email,
      username: user.username,
      // user_id: user.ID,
    });
  }

  private onReceived = () => {};

  private onOpened = ({ notification }: OSNotificationOpenedResult) => {
    const payload = notification.payload;

    console.log(notification, payload);

    if (!payload || !payload.additionalData) {
      return;
    }

    const { action } = payload.additionalData;

    if (action && action in this.pushHandlers) {
      for (const handler of this.pushHandlers[action]) {
        setTimeout(() => handler(payload as any), 0);
      }
    } else {
      this.defaultHandler(payload as any);
    }
  };

  registerHandler(name: string, handler: PushHandler) {
    if (!this.pushHandlers[name]) {
      this.pushHandlers[name] = [];
    }
    this.pushHandlers[name].push(handler);
  }
}
