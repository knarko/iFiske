import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslateLoadingController {
  constructor(private loadingCtrl: LoadingController, private translate: TranslateService) { }

  async create(opts?: LoadingOptions): Promise<Loading>{
    if (opts && opts.content) {
      opts.content = await this.translate.get(opts.content).toPromise()
    }
    return this.loadingCtrl.create(opts);
  }

  async show(opts?: LoadingOptions): Promise<Loading> {
    const loading = await this.create(opts);
    await loading.present();
    return loading;
  }

}
