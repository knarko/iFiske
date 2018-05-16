import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertOptions, AlertButton } from 'ionic-angular/components/alert/alert-options';

@Injectable()
export class TranslateAlertController {
  constructor(private translate: TranslateService, private alertCtrl: AlertController) {}

  async create(opts?: AlertOptions): Promise<Alert> {
    const toTranslate = ['message', 'title', 'subTitle'];
    if (opts) {
      for (const key of toTranslate) {
        if (opts[key]) {
          opts[key] = await this.translate.get(opts[key]).toPromise();
        }
      }
      if (opts.buttons) {
        for (const button of opts.buttons as AlertButton[]) {
          if (button.text) {
            button.text = await this.translate.get(button.text).toPromise();
          }
        }
      }
      if (opts.inputs) {
        for (const input of opts.inputs) {
          if (input.placeholder) {
            input.placeholder = await this.translate.get(input.placeholder).toPromise();
          }
          if (input.label) {
            input.label = await this.translate.get(input.label).toPromise();
          }
        }
      }
    }
    return this.alertCtrl.create(opts);
  }

  async show(opts?: AlertOptions): Promise<Alert> {
    const alert = await this.create(opts);
    await alert.present();
    return alert;
  }
}
