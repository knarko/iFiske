import { Injectable } from '@angular/core';
import { BaseModel } from '../database/basemodel';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { SessionProvider } from '../session/session';
import { ProductProvider } from '../product/product';
import { PushProvider } from '../push/push';
import { TableDef } from '../database/table';
import { Dictionary } from '../../types';
import { DBMethod } from '../database/decorators';
import { Area } from '../area/area';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TranslateLoadingController } from '../translate-loading-controller/translate-loading-controller';
import { TranslateToastController } from '../translate-toast-controller/translate-toast-controller';

export interface User {
  username: string;
  loggedin: string;
  IP1: string;
  IP2: string;
  name: string;
  email: string;
  created: string;
  mypage: string;
  profile: string;
}

@Injectable()
export class UserProvider extends BaseModel {
  private readonly tables: Dictionary<TableDef> = {
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
      },
    },
  };

  loggedIn = new ReplaySubject<boolean>(1);

  constructor(
    protected DB: DatabaseProvider,
    protected API: ApiProvider,
    private Push: PushProvider,
    // TODO: Toasts
    // ToastService,
    private loadingCtrl: TranslateLoadingController,
    private toastCtrl: TranslateToastController,
    private session: SessionProvider,
    private product: ProductProvider,
  ) {
    super();
    this.loggedIn.next(!!session.token);
    const p = [];
    for (const table of Object.values(this.tables)) {
      p.push(DB.initializeTable(table));
    }
    this.ready = Promise.all(p).then(changed => {
      for (let i = 0; i < changed.length; ++i) {
        if (changed[i])
          return this.update('skipWait');
      }
      return false;
    });
  }

	/**
		* Cleans all the user data from database
		* @return {Promise}  Promise when done
		*/
  clean() {
    const p = [];
    for (const table of Object.values(this.tables)) {
      p.push(this.DB.cleanTable(table.name));
    }
    // TODO: Raven
    // Raven.setUserContext();
    return Promise.all(p)
      .then(() => {
        console.log('Removed user info from database');
      }, err => {
        console.log('Could not remove user data from database!', err);
      });
  }

  async update(shouldUpdate): Promise<boolean> {
    if (!this.session.token || shouldUpdate !== 'skipWait' && await this.ready) {
      return false;
    }
    try {
      const p = [];
      p.push(this.API.user_get_favorites().then(favorites => {
        this.DB.populateTable(this.tables.favorite, favorites);
      }));
      p.push(this.API.user_info().then(data => {
        const numbers = data.numbers;
        const numArr = [];
        for (let i = 0; i < numbers.length; ++i) {
          numArr.push({ number: numbers[i] });
        }

        // TODO: Raven
        // Raven.setUserContext(data);

        return Promise.all([
          this.DB.populateTable(this.tables.info, [data])
            .then(() => {
              return 'User_Info';
            }, err => {
              console.log(data);
              console.log(err);
              return Promise.reject(err);
            }),
          this.DB.populateTable(this.tables.number, numArr)
            .then(() => {
              return 'User_Numbers';
            }, err => {
              console.log(err);
              return Promise.reject(err);
            }),
        ]);
      }));
      p.push(this.API.user_products().then(products => {
        this.DB.populateTable(this.tables.product, products);
      }));

      return Promise.all(p).then(() => true);
    } catch (err) {
      if (err && err.error_code === 7) {
        // TODO: Toasts
        // ToastService.show('You have been logged out');
        this.logout();
      }
      throw err;
    }
  }

  login({username, password}) {
    const p = this.API.user_login(username, password)
      .then(() => this.update(true));
    p.then(() => {
      this.loggedIn.next(true);
      this.Push.reset();
      // TODO: Analytics
      // analytics.trackEvent('Login and Signup', 'Login');
    }, error => {
      this.loggedIn.next(false);
      Promise.all([
        // TODO: Analytics
        // analytics.trackEvent('Login and Signup', 'Login Failure'),
        // analytics.trackException('Login Failure', false),
      ]);
      return error;
    });
    return p;
  }

  async logout() {
    // TODO: Analytics
    // analytics.trackEvent('Login and Signup', 'Logout');
    const loading = await this.loadingCtrl.create({
      content: 'Logging out',
    });
    loading.present();
    this.loggedIn.next(false);

    const promise = Promise.all([
      this.clean(),
      this.API.user_logout(),
      this.Push.logout(),
    ]);
    promise.catch().then(async () => {
      loading.dismiss();
      (await this.toastCtrl.create({
        message: 'You are logged out',
        duration: 4000,
      })).present()
    });
    return promise;
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
    const getter = (id) => {
      return this.ready.then(() => {
        return this.DB.getSingle(`
								SELECT User_Product.*, Product.ai,
								Rule.t as rule_t,
								Rule.ver as rule_ver,
								Rule.d as rule_d
								FROM User_Product
								LEFT JOIN Product ON Product.ID = User_Product.pid
								LEFT JOIN Rule ON Rule.ID = Product.ri
								WHERE User_Product.ID = ?
							`, [id]).then(product => {
            if (!product) {
              return Promise.reject(`Couldn't find product with id '${id}`);
            }
            product.validity = this.product.getValidity(product);
            return product;
          });
      });
    }

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
  async getProducts() {
    return this.DB.getMultiple([
      'SELECT User_Product.*,',
      'Rule.t as rule_t,',
      'Rule.ver as rule_ver,',
      'Rule.d as rule_d',
      'FROM User_Product',
      'LEFT JOIN Product ON Product.ID = User_Product.pid',
      'LEFT JOIN Rule ON Rule.ID = Product.ri',
    ].join(' ')).then(products => {
      products.forEach(product => {
        console.log(product);
        product.validity = this.product.getValidity(product);
      });
      return products;
    });
  }

  @DBMethod
  async getFavorites() {
    return this.DB.getMultiple([
      'SELECT *',
      'FROM User_Favorite',
      'JOIN Area ON User_Favorite.a = Area.ID',
    ].join(' '));
  }

  @DBMethod
  async removeFavorite(id) {
    return this.DB.runSql([
      'DELETE FROM User_Favorite',
      'WHERE a = ?',
    ].join(' '), [id]);
  }

  @DBMethod
  async addFavorite(id) {
    return this.DB.runSql([
      'INSERT INTO User_Favorite',
      '(a, "not") VALUES (?, 0)',
    ].join(' '), [id]);
  }

  @DBMethod
  async setFavoriteNotification(id, not) {
    return this.DB.runSql([
      'UPDATE User_Favorite',
      'SET "not" = ? WHERE a = ?',
    ].join(' '), [not, id]);
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

  async resetPassword({username, code, password}) {
    await this.API.user_reset_password({
      username,
      password,
      code,
    });
    return this.login({username, password});
  }
}
