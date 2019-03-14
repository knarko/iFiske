import { Injectable } from '@angular/core';
import { BaseModel } from '../database/basemodel';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { TableDef } from '../database/table';
import { DBMethod } from '../database/decorators';

export interface Product {
  ID: number;
  ai: number;
  ch: number;
  hl: string;
  im: string;
  mod: number;
  no: string;
  pf: string;
  price: number;
  ri: number;
  so: number;
  t: string;
  t2: string;

  methods: { name: string }[];
}
@Injectable()
export class ProductProvider extends BaseModel<Product> {
  private static readonly methods = {
    web: { name: 'Web', icon: 'globe' },
    sms: { name: 'SMS', icon: 'phone-portrait' },
  };

  protected readonly tables: TableDef[] = [
    {
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
    },
  ];

  constructor(protected DB: DatabaseProvider, protected API: ApiProvider) {
    super();
    this.initialize();
  }

  transform(product: Product) {
    if (!product.methods) {
      product.methods = [];
    }
    if (product.ch === 0 || product.ch === 1) {
      product.methods.push(ProductProvider.methods.sms);
    }
    if (product.ch === 0 || product.ch === 2) {
      product.methods.push(ProductProvider.methods.web);
    }
    return product;
  }

  /**
   * Gets information about a product
   * @method getOne
   * @param {Integer} productID Product ID
   * @return {object} Object with a single product
   */
  @DBMethod
  async getOne(productID): Promise<Product> {
    return this.DB.getSingle(
      [
        'SELECT DISTINCT Product.*,',
        'Rule.t as rule_t,',
        'Rule.ver as rule_ver,',
        'Rule.d as rule_d',
        'FROM Product',
        'JOIN Rule ON Rule.ID = Product.ri',
        'WHERE ID = ?',
        'ORDER BY so',
      ].join(' '),
      [productID],
    ).then(this.transform);
  }

  /**
   * Gets all products from an area
   * @method getByArea
   * @param {Integer} areaID area ID
   * @return {array} Array of Products
   */
  @DBMethod
  async getByArea(areaID): Promise<Product[]> {
    return this.DB.getMultiple(
      [
        'SELECT DISTINCT Product.*,',
        'Rule.t as rule_t,',
        'Rule.ver as rule_ver,',
        'Rule.d as rule_d',
        'FROM Product',
        'JOIN Rule ON Rule.ID = Product.ri',
        'WHERE ai = ?',
        'ORDER BY so',
      ].join(' '),
      [areaID],
    ).then(products => products.map(this.transform));
  }
}
