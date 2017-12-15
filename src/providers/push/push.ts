import { Injectable } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { SessionProvider } from '../session/session';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SettingsProvider } from '../settings/settings';
import { serverLocation } from '../api/serverLocation';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';


interface PushHandler {
  (notification: any, payload?: any): void;
}
@Injectable()
export class PushProvider {
  private pushHandlers: {
    default: PushHandler;
    [key: string]: PushHandler[] | PushHandler;
  };

  private navCtrl: NavController;

  constructor(
    // private platform: Platform,
    // private API: ApiProvider,
    private app: App,
    private sessionData: SessionProvider,
    private alertCtrl: TranslateAlertController,
    private inAppBrowser: InAppBrowser,
    private settings: SettingsProvider,
  ) {
    // TODO: fix this hack
    this.navCtrl = this.app.getRootNav();
    this.pushHandlers = {
      default: async (notification) => {
        (await this.alertCtrl.create({
          message: notification.message,
        })).present();
      },

      /*
        * We got a new fishing permit. We will get the Code of the new permit
        * Payload should contain:
        * code: fishing permit code
        */
      NEW: [(_notification, payload) => {
        if (payload && payload.code) {
          this.navCtrl.push('PermitDetailPage', {id: payload.code});
        }
      }],

      /*
        * We got a request to make a fishing report
        * Payload should contain:
        * orgid: organisation id,
        * code: fishing permit code,
        */
      REP_REQ: [(_notification, payload) => {
        if (payload && payload.orgid && payload.code) {
          this.alertCtrl.create({
            title: 'Do you want to create a catch report?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'OK',
                handler: () => {
                  this.inAppBrowser.create(`${serverLocation}/r/${payload.code}?lang=${this.settings.language}`, '_system');
                },
              },
            ],
          });
          // $state.go('app.create_report', {orgid: payload.orgid, code: payload.code});
        }
      }],

      /*
        * Someone made a report on a area we favorited
        * Payload should contain:
        * RepId: ID of the new report
        */
      NEW_FAV: [(_notification, payload) => {
        if (payload && payload.repid) {
          // $state.go('app.report', {id: payload.repid});
        }
      }],

      /*
        * Display a message
        * Payload should contain:
        * message: a string that we should Display
        */
      NOTE: [async (_notification, payload) => {
        if (payload && payload.message) {
          (await this.alertCtrl.create({
            message: payload.message,
          })).present();
        }
      }],
    };

    // TODO: Push notifications
    /*
    $ionicPlatform.ready(() => {
      $rootScope.$on('cloud:push:notification', this.handleNotification);
      $rootScope.$on('cloud:push:register', function (_event, data) {
        console.log('Registered a push token:', data);
      });
    });
    */
  }

  /*
  // TODO: Update this
  Flow of push notifications:
  1. Register with Ionic Cloud
  2. Get settings from Ionic Cloud
  Note: Do we want to persist all settings to cloud? We might want to keep some settings only on certain devices (push for example)
  3. Check if the user has enabled push notifications
  4. Enable/Disable push notifications

  Enabling:
  1. Register a push token with ionic
  2. Send the Ionic User ID to API servers

  Disabling:
  1. Unregister the push token with IonicCloud
  2. Tell API servers that we no longer want push notifications (how? we need a new API route)
  */

  private _handleNotification = (_event, notification) => {
    console.log(notification);
    const payload = notification.raw.additionalData.payload;
    let i;

    console.log('Push: Recieved a new push notification', notification, payload);
    if (payload.action in this.pushHandlers) {
      for (i = 0; i < this.pushHandlers[payload.action].length; ++i) {
        setTimeout(this.pushHandlers[payload.action][i], 0, true, notification, payload);
      }
    } else {
      this.pushHandlers.default(notification, payload);
    }
  }

  private startPush() {
    /*
    if (this.settings.push()) {
      console.log('Push: Registering for push notifications');
      return $ionicPlatform.ready().then(() => {
        return $ionicPush.register();
      })
        .then(function (token) {
          return $ionicPush.saveToken(token);
        });
    }
    // Unregister push
    if (!$ionicPush.token) {
      return $q.resolve('No tokens to unregister');
    }
    // $ionicPush returns a non-$q-promise, so we need to wrap it.
    console.log('Unregistering push tokens');
    return $q.when($ionicPush.unregister());
    */
  }

  logout() {
    // TypeError in Ionic Cloud that we have to catch
    /*
    try {
      return Promise.resolve($ionicPush.unregister())
        .finally(() => {
          return $ionicAuth.logout();
        });
    } catch (e) { }
    return $ionicAuth.logout();
    */
  }

  login(email, password) {
    /*
    return $ionicPlatform.ready().then(() => {
      const details = { email: email, password: password };
      return $ionicAuth.login('basic', details, { remember: true }).catch(function (errors) {
        console.warn('Push: errors on logging in:', errors);
        if (errors && errors.response && errors.response.statusCode === 401) {
          return $ionicAuth.signup(details).then(() => {
            return $ionicAuth.login('basic', details, { remember: true });
          }, function (err) {
            console.warn(err);
            Raven.captureException(err);
            if (err && err.details && err.details.indexOf('conflict_email') !== -1) {
              alert('There was an error logging in, please contact ifiske');
            }
          });
        }
        return errors;
      });
    }).then(() => {
      $ionicUser.save();
      console.log($ionicUser);
      console.log('Push: Sending userID to iFiske servers');
      return API.user_set_pushtoken($ionicUser.id);
    }).catch(function (err) {
      console.error('Push: we got an error!', err);
      Raven.captureException(err);
    });
    */
  }

  init() {
    if (!this.sessionData.token) {
      console.log('Push: No token, not initializing push notifications');
      return;
    }
    /*
    if ($ionicAuth.isAuthenticated() && !$ionicUser.isAnonymous()) {
      return startPush();
    }
    */
    /*
    const promises = [
      API.user_info(),
      API.user_get_secret(),
    ];
    return $q.all(promises).then(function (userInfo) {
      const email = userInfo[0].email;
      const password = userInfo[1];
      return login(email, password).then(() => {
        return startPush();
      });
    });
    */
  }

  reset() {
    return this.startPush();
  }
  registerHandler(name, handler) {
    if (name === 'default') {
      return;
    }
    if (!this.pushHandlers[name]) {
      this.pushHandlers[name] = [];
    }
    // TODO: stuff
    // this.pushHandlers[name].push(handler);
  }

}
