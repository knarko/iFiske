import { Injectable, isDevMode } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import * as Sentry from '@sentry/core';
import { SentryBrowser } from '@sentry/browser';
import { SentryCordova } from '@sentry/cordova';


Sentry.create('https://65d073d56d014385a2aca1276216cb91:0ce3e03a6ee04538937fde70b90b0b81@sentry.io/300552')
    .use(SentryCordova, {sentryBrowser: SentryBrowser})
    .install();


@Injectable()
export class MonitoringErrorHandler extends IonicErrorHandler {
  public handleError(err: any): void {
    if (isDevMode() && err && err.message && err.message.indexOf('cordova_not_available') !== -1) {
      return;
    }

    if (!isDevMode()) {
      // Only log errors to remote when running in production
      try {
        Sentry.getSharedClient().captureException(err.originalError | err);
      } catch (e) {
        console.error(e);
      }
    }

    super.handleError(err);
  }
}
