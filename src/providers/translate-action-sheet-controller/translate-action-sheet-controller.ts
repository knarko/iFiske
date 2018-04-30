import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetOptions } from 'ionic-angular';
import { ActionSheet } from 'ionic-angular/components/action-sheet/action-sheet';
import { ActionSheetButton } from 'ionic-angular/components/action-sheet/action-sheet-options';

export interface TranslateOptions {
  [key: string]: boolean;
}

@Injectable()
export class TranslateActionSheetController {

  constructor(
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  async create(opts?: ActionSheetOptions, translateOptions?: TranslateOptions): Promise<ActionSheet> {
    const toTranslate = ['title', 'subTitle'];
    if (opts) {
      for (const key of toTranslate) {
        if (opts[key]) {
          opts[key] = await this.translate.get(opts[key]).toPromise();
        }
      }
      if (opts.buttons && translateOptions.buttons !== false) {
        for (const button of opts.buttons as ActionSheetButton[]) {
          if (button.text) {
            button.text = await this.translate.get(button.text).toPromise();
          }
        }
      }
    }
    return this.actionSheetCtrl.create(opts)
  }

  async show(opts?: ActionSheetOptions, translateOptions?: TranslateOptions): Promise<ActionSheet> {
    const alert = await this.create(opts, translateOptions);
    await alert.present();
    return alert;
  }

}
