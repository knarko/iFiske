import { Injectable } from '@angular/core';
import { GoogleAnalytics as GoogleAnalyticsPlugin } from '@ionic-native/google-analytics';

import { googleAnalyticsTrackerID, APP_VERSION } from '../../app/config';

@Injectable()
export class GoogleAnalytics {
  private ready: Promise<any[]>;
  constructor(private ga: GoogleAnalyticsPlugin) {
    this.ready = this.ga.startTrackerWithId(googleAnalyticsTrackerID).then(() => {
      return Promise.all([this.ga.enableUncaughtExceptionReporting(true), this.ga.setAppVersion(APP_VERSION)]);
    });
  }

  /**
   * Track a screen
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
   *
   * @param title {string} Screen title
   * @param campaignUrl {string} Campaign url for measuring referrals
   * @param newSession {boolean} Set to true to create a new session
   * @returns {Promise<any>}
   */
  async trackView(title: string, campaignUrl?: string, newSession?: boolean): Promise<any> {
    await this.ready;
    return this.ga.trackView(title, campaignUrl, newSession);
  }

  /**
   * Track an event
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   * @param category {string}
   * @param action {string}
   * @param label {string}
   * @param value {number}
   * @param newSession {boolean} Set to true to create a new session
   * @returns {Promise<any>}
   */
  async trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number,
    newSession?: boolean,
  ): Promise<any> {
    await this.ready;
    return this.ga.trackEvent(category, action, label, value, newSession);
  }

  /**
   * Track an exception
   * @param description {string}
   * @param fatal {boolean}
   * @returns {Promise<any>}
   */
  async trackException(description: string, fatal: boolean): Promise<any> {
    return this.ga.trackException(description, fatal);
  }
}
