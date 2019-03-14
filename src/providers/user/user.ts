import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';

import { Dictionary } from '../../types';
import { getPermitValidity } from '../../util';
import { MonitoringClient } from '../../app/monitoring';

import { ApiProvider, IFISKE_ERRORS } from '../api/api';
import { Area } from '../area/area';
import { BaseModel } from '../database/basemodel';
import { DatabaseProvider } from '../database/database';
import { DBMethod } from '../database/decorators';
import { SessionProvider } from '../session/session';
import { TableDef } from '../database/table';
import { TranslateLoadingController } from '../translate-loading-controller/translate-loading-controller';
import { TranslateToastController } from '../translate-toast-controller/translate-toast-controller';

import { User, Favorite, Permit } from './userTypes';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Injectable()
export class UserProvider extends BaseModel {
  protected readonly tables: Dictionary<TableDef> = {
    info: {
      name: 'User_Info',
      primary: 'ID',
      members: {
        ID: 'int',
        username: 'text',
        loggedin: 'text',
        IP1: 'text',
        IP2: 'text',
        name: 'text',
        email: 'text',
        created: 'text',
        mypage: 'text',
        profile: 'text',
        adr: 'text',
        town: 'text',
        zip: 'text',
      },
    },
    number: {
      name: 'User_Number',
      primary: 'number',
      members: {
        number: 'text',
      },
    },
    favorite: {
      name: 'User_Favorite',
      primary: 'ID',
      members: {
        ID: 'int',
        a: 'int',
        add: 'int',
        not: 'int',
        cnt: 'int',
      },
    },
    product: {
      name: 'User_Product',
      primary: 'ID',
      members: {
        ID: 'int',
        adr: 'text',
        at: 'int',
        cc: 'text',
        city: 'text',
        code: 'int',
        fine: 'text',
        fr: 'int',
        fullname: 'text',
        info: 'text',
        ot: 'text',
        pdf: 'text',
        pid: 'int',
        price: 'text',
        qr: 'text',
        ref1: 'int',
        ref2: 'int',
        rev: 'int',
        subt: 'text',
        t: 'text',
        tel: 'text',
        to: 'int',
        zip: 'text',
      },
    },
  };

  loggedIn: Observable<boolean>;
  sessionTransferToken: Observable<string | undefined>;

  readonly updateStrategy = () => !!this.session.token;

  constructor(
    protected DB: DatabaseProvider,
    protected API: ApiProvider,
    private loadingCtrl: TranslateLoadingController,
    private toastCtrl: TranslateToastController,
    private session: SessionProvider,
    private analytics: FirebaseAnalytics,
  ) {
    super();
    this.initialize();
    this.loggedIn = this.session.tokenObservable.pipe(
      map(token => !!token),
      distinctUntilChanged(),
    );
    this.sessionTransferToken = this.loggedIn.pipe(
      switchMap(loggedIn => {
        if (loggedIn) {
          return this.API.getSessionToken().pipe(map(res => res.token));
        }
        return of(undefined);
      }),
      catchError(err => {
        console.log(err);
        return of(undefined);
      }),
    );
  }

  /**
   * Cleans all the user data from database
   * @return {Promise}  Promise when done
   */
  clean() {
    const p = Object.values(this.tables).map(t => this.DB.cleanTable(t.name));

    MonitoringClient.configureScope(scope => {
      scope.clear();
    });
    return Promise.all(p).then(
      () => {
        console.log('Removed user info from database');
      },
      err => {
        console.log('Could not remove user data from database!', err);
      },
    );
  }

  async update(skipWait?: boolean): Promise<boolean> {
    if (!this.session.token) {
      return false;
    }

    if (!skipWait) {
      await this.ready;
    }

    try {
      await Promise.all([
        this.API.user_get_favorites().then(favorites => {
          this.DB.populateTable(this.tables.favorite, favorites);
        }),
        Promise.all([this.API.user_info(), this.API.user_get_del_adr()]).then(
          ([data, deliveryAddress]: [User, Partial<User>]) => {
            const numbers = (data as any).numbers;
            const numArr = [];
            for (let i = 0; i < numbers.length; ++i) {
              numArr.push({ number: numbers[i] });
            }

            MonitoringClient.configureScope(scope => {
              scope.setUser({
                id: '' + data.ID,
              });
            });

            Object.assign(data, deliveryAddress);

            return Promise.all([
              this.DB.populateTable(this.tables.info, [data]).then(
                () => {
                  return 'User_Info';
                },
                err => {
                  console.log(data);
                  console.log(err);
                  return Promise.reject(err);
                },
              ),
              this.DB.populateTable(this.tables.number, numArr).then(
                () => {
                  return 'User_Numbers';
                },
                err => {
                  console.log(err);
                  return Promise.reject(err);
                },
              ),
            ]);
          },
        ),
        this.API.user_products().then(products => {
          this.DB.populateTable(this.tables.product, products);
        }),
      ]);

      return true;
    } catch (err) {
      if (err && err.error_code === IFISKE_ERRORS.AUTHENTICATION_FAILURE) {
        this.toastCtrl.show({
          message: 'You have been logged out',
          duration: 4000,
        });
        this.logout();
      }
      throw err;
    }
  }

  async login({ username, password }) {
    await this.clean();

    const p = this.API.user_login(username, password).then(data => {
      this.ready = Promise.resolve().then(() => {
        this.session.token = data;
        return this.update(true);
      });
      return this.ready;
    });

    p.then(
      u => {
        // TODO: set userId?
        this.analytics.logEvent('user_login', {});
      },
      error => {
        this.session.token = undefined;
        return error;
      },
    );
    return p;
  }

  async logout() {
    // TODO: remove userId?
    this.analytics.logEvent('user_logout', {});
    const loading = await this.loadingCtrl.show({
      content: 'Logging out',
    });

    const promise = Promise.all([this.clean(), this.API.user_logout()]);
    promise
      // It doesn't matter if this fails or not, we still want to clean up the user on this phone
      .catch(err => console.warn(err))
      .then(() => {
        this.session.token = undefined;
        loading.dismiss();
        this.toastCtrl.show({
          message: 'You have been logged out',
          duration: 4000,
        });
      });
    return promise;
  }

  async changePassword({ oldPassword, newPassword }) {
    return this.API.user_change_password(oldPassword, newPassword);
  }

  @DBMethod
  async getInfo(): Promise<User> {
    return this.DB.getSingle(`SELECT * FROM User_Info`);
  }

  @DBMethod
  async getNumbers() {
    return this.DB.getMultiple(`SELECT * FROM User_Number`);
  }

  getProduct(id) {
    const getter = id => {
      return this.ready.then(() => {
        return this.DB.getSingle(
          `
								SELECT User_Product.*, Product.ai,
								Rule.t as rule_t,
								Rule.ver as rule_ver,
								Rule.d as rule_d
								FROM User_Product
								LEFT JOIN Product ON Product.ID = User_Product.pid
								LEFT JOIN Rule ON Rule.ID = Product.ri
								WHERE User_Product.ID = ?
							`,
          [id],
        ).then((product: Permit) => {
          if (!product) {
            return Promise.reject(`Couldn't find product with id '${id}`);
          }
          product.validity = getPermitValidity(product);
          return Promise.resolve(product);
        });
      });
    };

    return getter(id).catch(err => {
      console.warn(err);
      return this.API.user_products()
        .then(products => {
          return this.DB.populateTable(this.tables.product, products);
        })
        .then(() => {
          return getter(id);
        });
    });
  }

  @DBMethod
  async getProducts(): Promise<Permit[]> {
    return this.DB.getMultiple(
      [
        'SELECT User_Product.*,',
        'Rule.t as rule_t,',
        'Rule.ver as rule_ver,',
        'Rule.d as rule_d',
        'FROM User_Product',
        'LEFT JOIN Product ON Product.ID = User_Product.pid',
        'LEFT JOIN Rule ON Rule.ID = Product.ri',
      ].join(' '),
    ).then(products => {
      products.forEach(product => {
        console.log(product);
        product.validity = getPermitValidity(product);
      });
      return products;
    });
  }

  @DBMethod
  async getFavorites(): Promise<(Favorite & Area)[]> {
    return this.DB.getMultiple(['SELECT *', 'FROM User_Favorite', 'JOIN Area ON User_Favorite.a = Area.ID'].join(' '));
  }

  @DBMethod
  async removeFavorite(id) {
    return this.DB.runSql(['DELETE FROM User_Favorite', 'WHERE a = ?'].join(' '), [id]);
  }

  @DBMethod
  async addFavorite(id) {
    return this.DB.runSql(['INSERT INTO User_Favorite', '(a, "not") VALUES (?, 0)'].join(' '), [id]);
  }

  @DBMethod
  async setFavoriteNotification(id, not) {
    await this.API.user_set_favorite_notification(id, not);
    return this.DB.runSql(['UPDATE User_Favorite', 'SET "not" = ? WHERE a = ?'].join(' '), [not, id]);
  }

  async toggleFavorite(area: Area) {
    area.favorite = !area.favorite;
    if (area.favorite) {
      await this.API.user_add_favorite(area.ID);
      await this.addFavorite(area.ID);
    } else {
      await this.API.user_remove_favorite(area.ID);
      await this.removeFavorite(area.ID);
    }
    return area.favorite;
  }

  async resetPassword({ username, code, password }) {
    await this.API.user_reset_password({
      username,
      password,
      code,
    });
    return this.login({ username, password });
  }

  async setDeliveryAddress(opts: { zip?: string; town?: string; adr?: string }) {
    await this.API.user_set_del_adr(opts);
    await this.update();
  }
}
