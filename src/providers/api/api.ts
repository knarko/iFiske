import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { serverLocation } from './serverLocation';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import { SettingsProvider } from '../settings/settings';
import { SessionProvider } from '../session/session';

function delay(fn, t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn().then(resolve, reject);
    }, t);
  });
}

interface ApiResponse {
  message?: any;
  data?: any;
  status: 'success' | 'error';
}

export interface ApiError {
  response: string;
  error_code: number;
}

@Injectable()
export class ApiProvider {

  private base_url = serverLocation + '/api/v2/api.php';
  private readonly maxRetries = 1;
  constructor(private http: HttpClient, private sessionData: SessionProvider, private settings: SettingsProvider) {

  }

  /**
     * internal function for making a call to the ifiske API
     * @param  {object} params parameters for the api call. Should always contain 'm', which is the api "method" to request.
     * @param  {number} retries The amount of retries for this request. Should not be sent by a user.
     * @return {promise}        $http promise
     */
  private api_call(params, retry?: number | false) {

    let retries: number;
    if (retry === false) {
      retries = this.maxRetries;
    } else {
      retries = Number(retry) || 0;
    }

    Object.assign(params, {
      lang: this.settings.language,
      key: 'ox07xh8aaypwvq7a',
    });

    return this.http.get(this.base_url, {
      params: Object.keys(params).reduce((p, k) => p.set(k, params[k]), new HttpParams()),
    })
      .toPromise()
      .then((response: ApiResponse) => {
        if (response.status !== 'error' && response.data && response.data.response) {
          return Promise.resolve(response.data.response);
        }
        return Promise.reject(response);
      }).catch(response => {
        if (retries < this.maxRetries) {
          return delay(() => {
            return this.api_call(params, ++retries);
          }, 2000 * retries);
        }
        if (!response) {
          return Promise.reject('Unknown network failure');
        } else if (response.status === 0) {
          return Promise.reject('Request timeout');
        } else if (response.message) {
          return Promise.reject(response.message);
        } else if (response.data) {
          return Promise.reject(response.data);
        }
        return Promise.reject(`Network Error: ${JSON.stringify(response, null, 1)}`);
      });
  }

  /**
     * wrapper for this.api_call - inserts the session token into params
     * takes the same arguments as this.api_call
     * @param  {object} params Same as this.api_call
     * @param  {boolean} retry  Same as this.api_call
     * @return {promise}       Same as this.api_call
     */
  private session_api_call(params, retry?) {
    var session = this.sessionData.token;
    return this.api_call(Object.assign(params, { s: session }), retry);
  }

  get(m, extras?) {
    return this.api_call(Object.assign({ m: m }, extras));
  }

  get_municipalities() {
    return this.api_call({ m: 'get_municipalities' });
  }
  get_counties() {
    return this.api_call({ m: 'get_counties' });
  }
  user_exists(username, email) {
    var args: any = { m: 'user_exists' };

    if (username && typeof username === 'string') {
      args.username = username;
    }
    if (email && typeof email === 'string') {
      args.email = email;
    }

    return this.api_call(args, false);
  }
  user_register(userDetails) {
    return this.api_call(Object.assign({ m: 'user_register' }, userDetails), false);
  }
  user_confirm(username, pin) {
    return this.api_call({
      m: 'user_confirm',
      username: username,
      pin: pin,
    }, false);
  }
  user_info() {
    return this.session_api_call({ m: 'user_info' });
  }
  user_lost_password(user) {
    return this.api_call({
      m: 'user_lost_password',
      user_identification: user,
    }, false);
  }
  user_reset_password({
    username,
    password,
    code,
  }) {
    return this.api_call({
      m: 'user_reset_password',
      user_identification: username,
      password,
      code,
    }, false);
  }
  user_change_password(old_password, new_password) {
    return this.session_api_call({
      m: 'user_change_password',
      old_password: old_password,
      new_password: new_password,
    }, false);
  }
  user_login(username, password) {
    return this.api_call({
      m: 'user_login',
      username: username,
      password: password,
    }, false)
      .then((data) => {
        this.sessionData.token = data;
        // needed for chaining of promises
        return data;
      });
  }
  user_logout() {
    return this.session_api_call({ m: 'user_logout' }, false)
      .then(() => {
        this.sessionData.token = undefined;
      });
  }
  user_products() {
    return this.session_api_call({ m: 'user_products' }, false);
  }
  user_get_pushtoken() {
    return this.session_api_call({ m: 'user_get_pushtoken' }, false);
  }
  user_get_secret() {
    return this.session_api_call({ m: 'user_get_secret' }, false);
  }
  user_set_pushtoken(token) {
    return this.session_api_call({
      m: 'user_set_pushtoken',
      token: token,
      type: 1, // 1 is for ionic
    }, false);
  }

  /*
       * Administration endpoints
       */
  user_organizations() {
    return this.session_api_call({ m: 'user_organizations' }, false);
  }
  adm_products(orgid) {
    return this.session_api_call({ m: 'adm_products', orgid: orgid }, false);
  }
  adm_revoke_prod(code, flag) {
    return this.session_api_call({ m: 'adm_revoke_prod', code: code, flag: flag }, false);
  }
  adm_check_prod(code) {
    return this.session_api_call({ m: 'adm_check_prod', code: code }, false);
  }
  adm_get_stats(orgid) {
    return this.session_api_call({ m: 'adm_get_stats', orgid: orgid }, false);
  }

  get_fishes() {
    return this.api_call({ m: 'get_fishes' });
  }
  get_techniques() {
    return this.api_call({ m: 'get_techniques' });
  }
  get_baits() {
    return this.api_call({ m: 'get_baits' });
  }
  get_organizations(orgid) {
    return this.api_call({
      m: 'get_organizations',
      orgid: orgid,
    });
  }
  get_org_modified(orgid) {
    return this.api_call({
      m: 'get_org_modified',
      orgid: orgid,
    });
  }
  get_areas(areaid) {
    return this.api_call({
      m: 'get_areas',
      areaid: areaid,
    });
  }
  get_areas_modified(areaid) {
    return this.api_call({
      m: 'get_areas_modified',
      areaid: areaid,
    });
  }
  get_products(areaid) {
    return this.api_call({
      m: 'get_products',
      areaid: areaid,
    });
  }
  get_rules(ruleid) {
    return this.api_call({
      m: 'get_rules',
      ruleid: ruleid,
    });
  }
  get_photos(orgid, areaid) {
    return this.api_call({
      m: 'get_photos',
      orgid: orgid,
      areaid: areaid,
    });
  }
  get_map_pois(orgid?) {
    return this.api_call({
      m: 'get_map_pois',
      orgid: orgid,
    });
  }
  get_map_poi_types() {
    return this.api_call({ m: 'get_map_poi_types' });
  }
  get_map_polygons(orgid?) {
    return this.api_call({
      m: 'get_map_polygons',
      orgid: orgid,
    });
  }
  user_get_favorites() {
    return this.session_api_call({ m: 'user_get_favorites' }, false);
  }
  user_add_favorite(area) {
    // Flag 0 means to not get notifications on catch reports
    return this.session_api_call({ m: 'user_add_favorite', areaid: area, flag: 0 }, false);
  }
  user_set_favorite_notification(area, flag) {
    flag = flag ? 1 : 0;
    return this.session_api_call({
      m: 'user_set_favorite_notification',
      areaid: area,
      flag: flag,
    }, false);
  }
  user_remove_favorite(area) {
    return this.session_api_call({ m: 'user_remove_favorite', areaid: area }, false);
  }
  get_terms_of_service() {
    return this.api_call({ m: 'get_terms_of_service' });
  }
  get_contact_info() {
    return this.api_call({ m: 'get_contact_info' });
  }
  get_enginepolicies() {
    return this.api_call({ m: 'get_enginepolicies' });
  }
  get_sms_terms() {
    return this.api_call({ m: 'get_sms_terms' });
  }
  get_mapbox_api() {
    return this.api_call({ m: 'get_mapbox_apiaccesstoken' });
  }
  get_content_menu = () => {
    return this.api_call({ m: 'get_content_menu' });
  }

  get_ads_main = () => this.api_call({ m: 'get_ads_main' })


}
