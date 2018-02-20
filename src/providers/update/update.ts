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
    product: ProductProvider,
    organization: OrganizationProvider,
    // Product,
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
      rule,
      user,
      terms,
      technique,
      // Product.update,
      // Terms.update,
    ];

  }

  private timedUpdate(currentTime: number) {
    var lastUpdate = Number(localStorage.getItem(UpdateProvider.LAST_UPDATE));

    var aDay = 1000 * 3600 * 24 * 1;
    return (currentTime - lastUpdate) > aDay;
  }

  async update(forced = false, hideLoading = false) {
    // TODO: this seems to block updating sometimes :/
    // await this.network.onConnect().pipe(take(1)).toPromise();

    if (!hideLoading) {
      this.loading = await this.loadingCtrl.show({
        content: 'Updating',
      });
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
        console.log(provider);
        return provider.update();
      }
      return Promise.resolve(false);
    });

    const result = Promise.all(promises).then(() => {
      if (timeHasPassed) {
        localStorage.setItem(UpdateProvider.LAST_UPDATE, "" + currentTime);
      }
    }, (error) => {
      // TODO: raven
      // Raven.captureException(error);
      this.toastCtrl.show({
        message: 'Network Error',
        duration: 4000,
      });


      // Must rethrow error to fail later
      throw error;
    });

    result.catch(() => { }).then(() => {
      this.loading.dismiss();
    });
    return result;
  }

  get lastUpdate() {
    return localStorage.getItem(UpdateProvider.LAST_UPDATE);
  }
}
