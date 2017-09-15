import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { MapDataProvider } from '../map-data/map-data';
import { LoadingController, ToastController, Loading } from 'ionic-angular';
import { AreaProvider } from '../area/area';
import { FishProvider } from '../fish/fish';
import { UserProvider } from '../user/user';
import { OrganizationProvider } from '../organization/organization';
import { InformationProvider } from '../information/information';

@Injectable()
export class UpdateProvider {
  // TODO: Better type
  updates: any[];
  private static readonly LAST_UPDATE = 'last_update';

  loading: Loading;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,

    private area: AreaProvider,
    // County,
    private fish: FishProvider,
    private information: InformationProvider,
    private mapData: MapDataProvider,
    // News,
    private organization: OrganizationProvider,
    // Product,
    // Rule,
    // Technique,
    // Terms,
    private user: UserProvider,
  ) {

    this.updates = [
      area,
      fish,
      information,
      mapData,
      organization,
      user,
      // County.update,
      // Product.update,
      // Rule.update,
      // Technique.update,
      // Terms.update,
    ];

  }
  timedUpdate(currentTime) {
    var lastUpdate = Number(localStorage.getItem(UpdateProvider.LAST_UPDATE));

    var aDay = 1000 * 3600 * 24 * 1;
    return (currentTime - lastUpdate) > aDay;
  }
  updateFunc(forced, hideLoading) {
    if (!hideLoading)
      this.loading = this.loadingCtrl.create();
    var currentTime = Date.now();
    var shouldUpdate = (forced || this.timedUpdate(currentTime));

    var promises = [];
    for (var i = 0; i < this.updates.length; ++i) {
      promises.push(this.updates[i].update(shouldUpdate));
    }

    return Promise.all(promises).then(() => {
      if (shouldUpdate) {
        localStorage.setItem(UpdateProvider.LAST_UPDATE, "" + currentTime);
      }
      this.loading.dismiss();
    }, (error) => {
      console.error(error);

      // TODO: raven
      // Raven.captureException(error);
      // TODO: toast
      // ToastService.show(['Network Error', { error: error.response || error }], 'long');

      // Must rethrow error to fail later
      this.loading.dismiss();
      throw error;
    });
  }

  update(hideLoading = false) {
    return this.updateFunc(false, hideLoading);
  }

  forcedUpdate(hideLoading = false) {
    return this.updateFunc(true, hideLoading);
  }

  lastUpdate() {
    return localStorage.getItem(UpdateProvider.LAST_UPDATE);
  }
}
