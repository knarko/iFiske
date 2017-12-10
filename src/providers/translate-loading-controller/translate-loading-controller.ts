import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the TranslateLoadingControllerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslateLoadingController {
  constructor(private loadingCtrl: LoadingController, private translate: TranslateService) { }

  async create(opts?: LoadingOptions): Promise<Loading>{
    if (opts && opts.content) {
      opts.content = await this.translate.get(opts.content).toPromise()
    }
    return this.loadingCtrl.create(opts);
  }

}
