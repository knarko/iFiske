import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslateLoadingController {
  private showing = false;

  private queue: Loading[] = [];

  constructor(private loadingCtrl: LoadingController, private translate: TranslateService) {}

  async create(opts?: LoadingOptions): Promise<Loading> {
    if (opts && opts.content) {
      opts.content = await this.translate.get(opts.content).toPromise();
    }
    return this.loadingCtrl.create(opts);
  }

  private async showNext() {
    const next = this.queue.shift();
    if (next) {
      return next.present();
    } else {
      this.showing = false;
    }
  }

  async show(opts?: LoadingOptions): Promise<Loading> {
    const loading = await this.create(opts);

    const dismissed = () => {
      const index = this.queue.indexOf(loading);
      if (index !== -1) {
        this.queue.splice(this.queue.indexOf(loading), 1);
      } else {
        this.showNext();
      }
    };
    loading.onWillDismiss(dismissed);

    if (this.showing) {
      const origDismiss = loading.dismiss.bind(loading);
      loading.dismiss = (data, role, options) => {
        dismissed();
        return origDismiss(data, role, options);
      };
      this.queue.push(loading);
    } else {
      this.showing = true;
      await loading.present();
    }

    return loading;
  }
}
