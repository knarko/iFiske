import { Injectable } from '@angular/core';
import { Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { AreaProvider } from '../area/area';
import { CountyProvider } from '../county/county';
import { FishProvider } from '../fish/fish';
import { InformationProvider } from '../information/information';
import { MapDataProvider } from '../map-data/map-data';
import { OrganizationProvider } from '../organization/organization';
import { ProductProvider } from '../product/product';
import { RuleProvider } from '../rule/rule';
import { SettingsProvider } from '../settings/settings';
import { TechniqueProvider } from '../technique/technique';
import { TermsProvider } from '../terms/terms';
import { UserProvider } from '../user/user';

import { TranslateLoadingController } from '../translate-loading-controller/translate-loading-controller';
import { TranslateToastController } from '../translate-toast-controller/translate-toast-controller';

export type UpdateFn = () => boolean;
export type UpdateStrategy = 'timed' | 'always' | UpdateFn;

@Injectable()
export class UpdateProvider {
  updating?: Promise<any>;
  updates: {
    updateStrategy: UpdateStrategy;
    update: () => Promise<boolean>;
  }[];
  private static readonly LAST_UPDATE = 'last_update';

  loading: Loading;

  constructor(
    private loadingCtrl: TranslateLoadingController,
    private toastCtrl: TranslateToastController,
    private translate: TranslateService,
    private settings: SettingsProvider,

    area: AreaProvider,
    county: CountyProvider,
    fish: FishProvider,
    information: InformationProvider,
    mapData: MapDataProvider,
    organization: OrganizationProvider,
    product: ProductProvider,
    rule: RuleProvider,
    technique: TechniqueProvider,
    terms: TermsProvider,
    user: UserProvider,
  ) {
    let savedLanguage = this.settings.language;
    this.translate.onLangChange.subscribe(() => {
      if (savedLanguage !== this.settings.language) {
        savedLanguage = this.settings.language;
        this.update(true);
      }
    });

    this.updates = [
      area,
      county,
      fish,
      information,
      mapData,
      organization,
      product,
      rule,
      technique,
      terms,
      user,
    ];

  }

  private timedUpdate(currentTime: number) {
    var lastUpdate = Number(localStorage.getItem(UpdateProvider.LAST_UPDATE));

    var aDay = 1000 * 3600 * 24 * 1;
    return (currentTime - lastUpdate) > aDay;
  }

  async showLoading(force?: boolean) {
    const loading = await this.loadingCtrl.create({
      content: 'Updating',
    });

    if (force || this.updating) {
      this.loading = loading;
      loading.present()
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = undefined;
    }
  }


  update(forced = false, hideLoading = false) {
    if (this.updating) {
      return this.updating;
    }

    // TODO: this seems to block updating sometimes :/
    // await this.network.onConnect().pipe(take(1)).toPromise();

    if (!hideLoading) {
      this.showLoading(true);
    }

    var currentTime = Date.now();
    const timeHasPassed = this.timedUpdate(currentTime);

    var promises = this.updates.map(provider => {
      if (
        forced ||
        (provider.updateStrategy === 'always') ||
        (provider.updateStrategy === 'timed' && timeHasPassed)  ||
        (typeof provider.updateStrategy === 'function' && provider.updateStrategy())
      ) {
        return provider.update();
      }
      return Promise.resolve(false);
    });

    this.updating = Promise.all(promises).then(() => {
      localStorage.setItem(UpdateProvider.LAST_UPDATE, "" + currentTime);
    }, (error) => {
      this.toastCtrl.show({
        message: 'Network Error',
        duration: 4000,
      });

      if (error.name === 'TimeoutError') {
        // Timeouts are not that interesting, we don't want to error later for those.
        return;
      }

      throw error;
    });

    this.updating.catch(() => { }).then(() => {
      this.updating = undefined;
      this.hideLoading();
    });
    return this.updating;
  }

  get lastUpdate() {
    return localStorage.getItem(UpdateProvider.LAST_UPDATE);
  }
}
