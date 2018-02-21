import { Injectable } from '@angular/core';
import { ToastController, ToastOptions as OriginalToastOptions, Toast } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

interface BetterToastOptions {
  duration: number;
}

export type ToastOptions = OriginalToastOptions & BetterToastOptions;

@Injectable()
export class TranslateToastController {

  constructor(private translate: TranslateService, private toastCtrl: ToastController) {
  }

  async create(opts?: ToastOptions): Promise<Toast> {
    const toTranslate = ['message', 'closeButtonText'];
    if (opts) {
      for (const key of toTranslate) {
        if (opts[key]) {
          opts[key] = await this.translate.get(opts[key]).toPromise();
        }
      }
    }
    return this.toastCtrl.create(opts);
  }

  async show(opts?: ToastOptions): Promise<Toast> {
    const toast = await this.create(opts);
    await toast.present();
    return toast;
  }



}
