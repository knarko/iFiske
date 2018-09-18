import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { serverLocation } from '../api/serverLocation';
import { CustomQueryEncoder } from '../api/QueryEncoder';
import { UserProvider } from '../user/user';
import { SettingsProvider } from '../settings/settings';
import { Dictionary } from '../../types';
import { PlatformProvider } from '../platform/platform';

export enum DeepLinks {
  buy,
  catchReport,
  controlPanel,
  organization,
  userProfile,
}

interface DeepLinkOptions {
  bringMetadata?: boolean;
  bringSession?: boolean;
}

const addQuery = (query: HttpParams) => {
  if (query.keys().length) {
    return `?${query.toString()}`;
  }
  return '';
};

@Injectable()
export class DeepLinksProvider {
  sub: Subscription;
  private token: string;
  constructor(
    private userProvider: UserProvider,
    private settings: SettingsProvider,
    private platform: PlatformProvider,
  ) {
    this.getToken();
  }
  getToken() {
    console.log('Getting new token');
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.userProvider.sessionTransferToken.subscribe(token => {
      console.log('Saving token:', token);
      this.token = token;
    });
  }
  open(link: DeepLinks, params?: Dictionary<string>, options?: DeepLinkOptions) {
    const url = this.getUrl(link, params, options);
    window.open(url, '_system', 'noopener');
  }

  getUrl(link: DeepLinks, params?: Dictionary<string>, options?: DeepLinkOptions) {
    const { bringMetadata, bringSession } = Object.assign({ bringSession: false, bringMetadata: true }, options);
    let query = new HttpParams({
      encoder: new CustomQueryEncoder(),
      fromObject: bringMetadata
        ? {
            lang: this.settings.language,
            app: 'true',
            device: this.platform.platform,
          }
        : {},
    });
    if (bringSession && this.token) {
      query = query.append('token', this.token);
      this.token = undefined;
      setTimeout(() => this.getToken(), 5000);
    }

    let url: string;
    switch (link) {
      case DeepLinks.buy:
        if (params.productId == undefined) {
          throw new Error('You need to add the ID of the permit.');
        }

        url = `${serverLocation}/buy/${params.productId}`;
        break;

      case DeepLinks.catchReport:
        if (params.ID == undefined) {
          throw new Error('You need to specify an ID for the catch report');
        }
        url = `${serverLocation}/r/${params.ID}`;
        break;

      case DeepLinks.controlPanel:
        if (params.orgId != undefined) {
          query = query.append('org', params.orgId);
        }
        url = `${serverLocation}/kontrollpanel`;
        break;

      case DeepLinks.organization:
        if (params.orgId == undefined) {
          throw new Error('You need to give an orgId');
        }
        url = `${serverLocation}/o/${params.orgId}`;
        break;

      case DeepLinks.userProfile:
        url = `${serverLocation}/user-profile`;
        break;

      default:
        throw new Error('Cannot handle this link!' + link);
    }

    url = `${url}${addQuery(query)}`;

    console.log('Constructed url:', url);
    return url;
  }
}
