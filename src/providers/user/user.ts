import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

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
        at: 'int',
        code: 'int',
        fr: 'int',
        fullname: 'text',
        ot: 'text',
        ref1: 'int',
        ref2: 'int',
        t: 'text',
        subt: 'text',
        to: 'int',
        pid: 'int',
        pdf: 'text',
        qr: 'text',
        fine: 'text',
        rev: 'int',
        info: 'text',
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
    private ga: GoogleAnalytics,
  ) {
    super();
    this.initialize();
    this.loggedIn = this.session.tokenObservable.pipe(map(token => !!token));
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
        this.API.user_info().then((data: User) => {
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
        }),
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

    const p = this.API.user_login(username, password).then(() => this.update(true));

    p.then(
      () => {
        this.ga.trackEvent('Login and Signup', 'Login');
      },
      error => {
        this.session.token = undefined;
        this.ga.trackEvent('Login and Signup', 'Login Failure');
        this.ga.trackException('Login Failure', false);
        return error;
      },
    );
    return p;
  }

  async logout() {
    this.ga.trackEvent('Login and Signup', 'Logout');
    const loading = await this.loadingCtrl.show({
      content: 'Logging out',
    });

    const promise = Promise.all([this.clean(), this.API.user_logout()]);
    promise.catch(() => {}).then(() => {
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
}
