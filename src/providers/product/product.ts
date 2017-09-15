import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseModel } from '../database/basemodel';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';

/*
  Generated class for the ProductProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductProvider extends BaseModel {
  protected readonly table = {
    name: 'Product',
    primary: 'ID',
    apiMethod: 'get_products',
    members: {
      ID: 'int',
      t: 'text',
      t2: 'text',
      no: 'text',
      im: 'text',
      pf: 'text',
      ai: 'int',
      ri: 'int',
      ch: 'int',
      price: 'int',
      mod: 'int',
      so: 'int',
      hl: 'text',
    },
  };

  constructor(
    protected DB: DatabaseProvider,
    protected API: ApiProvider,
  ) {
    super();
    this.initialize();
  }

  getValidity(product) {
    if (product.rev === 1) {
      return 'revoked';
    }
    const now = parseInt("" + Date.now() / 1000, 10);
    if (product.fr < now) {
      return now < product.to ? 'active' : 'expired';
    }
    return 'inactive';
  }

  /**
      * Gets information about a product
      * @method getOne
      * @param {Integer} productID Product ID
      * @return {object} Object with a single product
      */
  getOne(productID) {
    return this.wait.then(function () {
      return this.DB.getSingle([
        'SELECT DISTINCT Product.*,',
        'Rule.t as rule_t,',
        'Rule.ver as rule_ver,',
        'Rule.d as rule_d',
        'FROM Product',
        'JOIN Rule ON Rule.ID = Product.ri',
        'WHERE ID = ?',
        'ORDER BY so',
      ].join(' '),
        [productID]);
    });
  }

  /**
      * Gets all products from an area
      * @method getByArea
      * @param {Integer} areaID area ID
      * @return {array} Array of Products
      */
  getByArea(areaID) {
    return this.wait.then(function () {
      return this.DB.getMultiple([
        'SELECT DISTINCT Product.*,',
        'Rule.t as rule_t,',
        'Rule.ver as rule_ver,',
        'Rule.d as rule_d',
        'FROM Product',
        'JOIN Rule ON Rule.ID = Product.ri',
        'WHERE ai = ?',
        'ORDER BY so',
      ].join(' '),
        [areaID]);
    });
  }
}
