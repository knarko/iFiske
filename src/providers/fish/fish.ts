import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the FishProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FishProvider {

  constructor(public http: Http) {
    console.log('Hello FishProvider Provider');
  }

  search(arg0: any): any {
    throw new Error("Method not implemented.");
  }


}
