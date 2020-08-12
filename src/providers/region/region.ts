import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { skip } from 'rxjs/operators';
import { MonitoringClient } from '../../app/monitoring';
import { ActionSheetButton } from 'ionic-angular';
import { TranslateActionSheetController } from '../translate-action-sheet-controller/translate-action-sheet-controller';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';

export enum Regions {
  se = 'se',
  ax = 'ax',
}

export const serverLocations = {
  [Regions.se]: 'https://www.ifiske.se',
  [Regions.ax]: 'https://www.ifiske.ax',
} as Record<Regions, string>;

export const REGION_SAVE_KEY = 'IFISKE_SELECTED_REGION';

@Injectable()
export class RegionProvider {
  currentRegion$ = new BehaviorSubject<Regions>(undefined);

  serverLocation$ = new BehaviorSubject<string>(undefined);

  constructor(
    private httpClient: HttpClient,
    private actionSheetCtrl: TranslateActionSheetController,
    private alertCtrl: TranslateAlertController,
  ) {
    const savedRegion = localStorage.getItem(REGION_SAVE_KEY);
    if (savedRegion) {
      this.currentRegion$.next(savedRegion as Regions);
      this.serverLocation$.next(serverLocations[savedRegion]);
    } else {
      this.httpClient.get('https://ipapi.co/json').subscribe(
        (response: any) => {
          if (
            response &&
            response.country != undefined &&
            (response.country === 'FI' || response.country === 'AX')
          ) {
            this.currentRegion$.next(Regions.ax);
          } else {
            this.currentRegion$.next(Regions.se);
          }
        },
        (err) => {
          console.error(err);
          MonitoringClient.captureException(err);
          this.currentRegion$.next(Regions.se);
        },
      );
    }

    this.currentRegion$.pipe(skip(1)).subscribe((region) => {
      this.serverLocation$.next(serverLocations[region]);
      localStorage.setItem(REGION_SAVE_KEY, region);
    });
  }

  async selectRegion(showWarning: boolean = false) {
    const buttons = Object.values(Regions).map(
      (region): ActionSheetButton => ({
        text: 'ui.settings.regions.' + region,
        role: region,
      }),
    );
    buttons.push({ text: 'Cancel' });
    const sheet = await this.actionSheetCtrl.show({
      title: 'ui.settings.change_region',
      buttons: buttons,
    });

    const region = await new Promise<string>((resolve) =>
      sheet.onDidDismiss((_data, region) => resolve(region)),
    );

    if (!(region in Regions) || this.currentRegion$.value === region) {
      return;
    }
    if (showWarning) {
      const alert = await this.alertCtrl.show({
        title: 'ui.settings.change_region_warning_title',
        message: 'ui.settings.change_region_warning_message',
        buttons: ['OK'],
      });
      await new Promise((resolve) => alert.onDidDismiss(resolve));
    }
    this.currentRegion$.next(Regions[region]);
  }
}
