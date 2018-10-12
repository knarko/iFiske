import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { serverLocation } from './serverLocation';

import { SettingsProvider } from '../settings/settings';
import { SessionProvider } from '../session/session';
import { timeout, map, catchError, retryWhen, zip, switchAll, shareReplay } from 'rxjs/operators';
import { TranslateToastController } from '../translate-toast-controller/translate-toast-controller';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { range } from 'rxjs/observable/range';
import { Dictionary } from '../../types';
import { TimeoutError } from '../../errors';
import { CustomQueryEncoder } from './QueryEncoder';

interface ApiResponse {
  message?: any;
  data?: any;
  status: 'success' | 'error';
}

export interface ApiError {
  response: string;
  error_code: number;
}

export interface ApiOptions {
  retry?: boolean;
  cacheTime?: number;
  session?: boolean;
  post?: boolean;
}

export interface CachedResult {
  result: Observable<any>;
  removeAt: number;
  cacheTime: number;
}

export enum IFISKE_ERRORS {
  MISSING_API_KEY,
  INTERNAL_DATABASE_ERROR,
  TOO_SHORT_OR_EMPTY_USERNAME,
  TOO_SHORT_OR_EMPTY_PASSWORD,
  USER_EXISTS_BUT_USERNAME_OR_PASSWORD_INCORRECT,
  NO_SUCH_USER,
  UNKNOWN_ERROR,
  AUTHENTICATION_FAILURE,
  USER_CREATION_INVALID_EMAIL,
  USER_CREATION_USERNAME_OR_EMAIL_EXISTS,
  USER_CREATION_INVALID_PHONE,
  USER_CREATION_FULLNAME_LENGTH,
  USER_CREATION_USERNAME_LENGTH,
  TOO_SHORT_OR_LONG_PASSWORD,
  USER_CONFIRM_INVALID_PIN,
  USER_CONFIRM_NO_SUCH_USERNAME_PIN_COMBO,
  PASSWORD_CHANGE_INVALID_RESET_CODE,
  INSUFFICIENT_USER_ACCESS_LEVEL,
  USER_ACCOUNT_NOT_ACTIVATED,
  NO_SUCH_AREA_EXISTS,
  NO_SUCH_SUBSCRIPTION,
  INVALID_PUSHTOKEN_TYPE,
}

@Injectable()
export class ApiProvider {
  private static readonly DefaultOptions = {
    retry: true,
    cacheTime: 0,
    session: false,
  };

  private static readonly BASE_URL = serverLocation + '/api/v2/api.php';
  private readonly maxRetries = 2;

  private cache = new Map<string, CachedResult>();

  constructor(
    private http: HttpClient,
    private sessionData: SessionProvider,
    private settings: SettingsProvider,
    private toastCtrl: TranslateToastController,
  ) {
    /* Clear cache periodically */
    setInterval(() => {
      console.log('Clearing API cache');
      this.cache.forEach((val, key) => {
        if (val.removeAt < Date.now()) {
          this.cache.delete(key);
        }
      });
    }, 10 * 1000);
  }

  private getObservable(inputParams: Dictionary<string | number>, options?: ApiOptions): Observable<any> {
    options = Object.assign({}, ApiProvider.DefaultOptions, options);

    inputParams = Object.assign({}, inputParams, {
      lang: this.settings.language,
      key: 'ox07xh8aaypwvq7a',
    });

    Object.keys(inputParams).forEach(key => {
      inputParams[key] = '' + inputParams[key];
    });

    const params = new HttpParams({
      encoder: new CustomQueryEncoder(),
      fromObject: inputParams as Dictionary<string>,
    });

    const headersObject: Dictionary<string> = {
      Accept: 'application/json',
    };
    if (options.session) {
      headersObject['Authorization'] = `Bearer ${this.sessionData.token}`;
    }
    const headers = new HttpHeaders(headersObject);

    if (options.cacheTime && this.cache.has(params.toString())) {
      const res = this.cache.get(params.toString());
      console.log('found cached observable', res);
      if (res.cacheTime === options.cacheTime) {
        res.removeAt = Date.now() + options.cacheTime;
        return res.result;
      }
    }

    let httpResult;
    if (options.post) {
      httpResult = this.http.post(ApiProvider.BASE_URL, params, { headers });
    } else {
      httpResult = this.http.get(ApiProvider.BASE_URL, { params, headers });
    }
    const result$ = httpResult.pipe(
      timeout(10000),
      map((response: ApiResponse) => {
        if (response.status !== 'error' && response.data != undefined && response.data.response != undefined) {
          return response.data.response;
        }
        throw response;
      }),
      retryWhen(attempts =>
        attempts.pipe(
          zip(range(1, this.maxRetries + 1), (err, i) => {
            if (!options.retry || i > this.maxRetries) {
              throw err;
            }
            console.log('delaying API retry by ' + i * 2 + ' second(s).');
            return timer(i * 2000);
          }),
          switchAll(),
        ),
      ),
      catchError(err => {
        if (!err) {
          throw new Error('Unknown network failure');
        } else if (err.status === 0 || err.name === 'TimeoutError') {
          throw new TimeoutError(`Request '${params.get('m')}' timed out`);
        } else if (err.message) {
          switch (err.message.error_code) {
            case IFISKE_ERRORS.AUTHENTICATION_FAILURE:
              if (this.sessionData.token) {
                this.sessionData.token = undefined;
                this.toastCtrl.show({
                  message: 'You have been logged out',
                  duration: 6000,
                });
              }
              break;
          }
          throw err.message as ApiError;
        } else if (err.data) {
          throw err.data;
        }
        throw new Error(`Network Error: ${JSON.stringify(err, null, 1)}`);
      }),
    );

    if (options.cacheTime) {
      this.cache.set(params.toString(), {
        result: result$.pipe(shareReplay(1)),
        cacheTime: options.cacheTime,
        removeAt: Date.now() + options.cacheTime,
      });
    }

    return result$;
  }
  /**
   * internal function for making a call to the ifiske API
   * @param  {object} params parameters for the api call. Should always contain 'm', which is the api "method" to request.
   * @param  {number} retries The amount of retries for this request. Should not be sent by a user.
   * @return {promise}        $http promise
   */
  private api_call(params, options?: ApiOptions): Promise<any> {
    return this.getObservable(params, options).toPromise();
  }

  //TODO: UNUSED
  get_municipalities() {
    return this.api_call({ m: 'get_municipalities' });
  }
  get_counties() {
    return this.api_call({ m: 'get_counties' });
  }
  user_exists(username?: string, email?: string) {
    var args: any = { m: 'user_exists' };

    if (username && typeof username === 'string') {
      args.username = username;
    }
    if (email && typeof email === 'string') {
      args.email = email;
    }

    return this.api_call(args, { retry: false });
  }
  user_register(userDetails) {
    return this.api_call(Object.assign({ m: 'user_register' }, userDetails), { retry: false, post: true });
  }
  user_confirm(username, pin) {
    return this.api_call(
      {
        m: 'user_confirm',
        username: username,
        pin: pin,
      },
      { retry: false, post: true },
    );
  }
  user_info() {
    return this.api_call({ m: 'user_info' }, { session: true, cacheTime: 60000 });
  }
  user_lost_password(user) {
    return this.api_call(
      {
        m: 'user_lost_password',
        user_identification: user,
      },
      { retry: false, post: true },
    );
  }
  user_reset_password({ username, password, code }) {
    return this.api_call(
      {
        m: 'user_reset_password',
        user_identification: username,
        password,
        code,
      },
      { retry: false, post: true },
    );
  }
  user_change_password(old_password, new_password) {
    return this.api_call(
      {
        m: 'user_change_password',
        old_password: old_password,
        new_password: new_password,
      },
      { retry: false, session: true, post: true },
    );
  }
  user_login(username, password) {
    return this.api_call(
      {
        m: 'user_login',
        username: username,
        password: password,
      },
      { retry: false, post: true },
    ).then(data => {
      this.sessionData.token = data;
      // needed for chaining of promises
      return data;
    });
  }
  user_logout() {
    return (
      this.api_call({ m: 'user_logout' }, { retry: false, session: true, post: true })
        // It doesn't matter if this fails or not, we still want to clean up the user on this phone
        .catch(err => console.warn(err))
        .then(() => {
          this.sessionData.token = undefined;
        })
    );
  }
  user_products() {
    return this.api_call({ m: 'user_products' }, { retry: false, session: true });
  }
  user_set_pushtoken(token: string) {
    return this.api_call(
      {
        m: 'user_set_pushtoken',
        token: token,
        type: 2, // 2 is for FCM
      },
      { retry: false, session: true, post: true },
    );
  }
  /**
   * Get the delivery address, consisting of a street address, zip code and town name. If the user hasn’t set any, empty strings are returned.
   */
  user_get_del_adr() {
    return this.api_call({ m: 'user_get_del_adr' }, { session: true });
  }
  /**
   * Sets the users default delivery address
   */
  user_set_del_adr({ adr = '', town = '', zip = '' }) {
    return this.api_call({ m: 'user_set_del_adr', adr, town, zip }, { session: true, post: true, retry: false });
  }

  /*
       * Administration endpoints
       */
  user_organizations() {
    return this.api_call({ m: 'user_organizations' }, { retry: false, session: true });
  }
  adm_products(orgid) {
    return this.api_call({ m: 'adm_products', orgid: orgid }, { retry: false, session: true });
  }
  adm_revoke_prod(code, flag) {
    return this.api_call({ m: 'adm_revoke_prod', code: code, flag: flag }, { retry: false, session: true, post: true });
  }
  adm_check_prod(code) {
    return this.api_call({ m: 'adm_check_prod', code: code }, { retry: false, session: true });
  }
  adm_get_stats(orgid) {
    return this.api_call({ m: 'adm_get_stats', orgid: orgid }, { retry: false, session: true });
  }

  admGetStats(orgid?: number | string) {
    return this.getObservable(
      { m: 'adm_get_stats', orgid },
      {
        session: true,
        cacheTime: 30 * 1000,
      },
    );
  }

  get_fishes() {
    return this.api_call({ m: 'get_fishes' });
  }
  get_techniques() {
    return this.api_call({ m: 'get_techniques' });
  }
  // UNUSED
  get_baits() {
    return this.api_call({ m: 'get_baits' });
  }
  get_organizations(orgid) {
    return this.api_call({
      m: 'get_organizations',
      orgid: orgid,
    });
  }
  // UNUSED
  get_org_modified(orgid) {
    return this.api_call({
      m: 'get_org_modified',
      orgid: orgid,
    });
  }
  get_areas(areaid?: number | string) {
    return this.api_call({
      m: 'get_areas',
      areaid: areaid,
    });
  }
  get_images(orgid?: number | string, areaid?: number | string) {
    return this.api_call({
      m: 'get_images',
      orgid,
      areaid,
    });
  }
  // UNUSED
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
  // UNUSED
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
      orgid,
    });
  }
  user_get_favorites() {
    return this.api_call({ m: 'user_get_favorites' }, { retry: false, session: true });
  }
  user_add_favorite(area) {
    // Flag 0 means to not get notifications on catch reports
    return this.api_call(
      { m: 'user_add_favorite', areaid: area, flag: 0 },
      { retry: false, session: true, post: true },
    );
  }
  user_set_favorite_notification(area, flag) {
    flag = flag ? 1 : 0;
    return this.api_call(
      {
        m: 'user_set_favorite_notification',
        areaid: area,
        flag: flag,
      },
      { retry: false, session: true, post: true },
    );
  }
  user_remove_favorite(area) {
    return this.api_call({ m: 'user_remove_favorite', areaid: area }, { retry: false, session: true, post: true });
  }
  get_terms_of_service() {
    return this.api_call({ m: 'get_terms_of_service' });
  }
  get_contact_info() {
    return this.api_call({ m: 'get_contact_info' });
  }
  // UNUSED
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
  };

  getAdsMain = () => this.getObservable({ m: 'get_ads_main' }, { cacheTime: 60000 });

  getSessionToken = () => this.getObservable({ m: 'user_get_session_token' }, { session: true, retry: false });
}
