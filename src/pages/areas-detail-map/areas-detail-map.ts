import { Component, isDevMode } from '@angular/core';
import { transition, style, animate, state, trigger } from '@angular/animations';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapOptions } from '../../components/map/map';
import { MapDataProvider } from '../../providers/map-data/map-data';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import * as Sentry from '@sentry/core';
import { Area } from '../../providers/area/area';

@IonicPage()
@Component({
  selector: 'page-areas-detail-map',
  templateUrl: 'areas-detail-map.html',
  animations: [
    trigger('showNavigate', [
      state('show', style({ transform: 'rotate(45deg) scale(1)' })),
      state('hide', style({ transform: 'rotate(-120deg) scale(0)' })),
      transition('show => hide', animate('.3s cubic-bezier(0.68, -0.55, 0.27, 1)')),
      transition('hide => show', animate('.3s cubic-bezier(0.68, 0, 0.27, 1.55)')),
    ]),
  ],
})
export class AreasDetailMapPage {
  navigateTo: {
    lat: number;
    lng: number;
    title: string;
  };
  showNavigate: 'show' | 'hide' = 'hide';

  options: MapOptions = {};

  private area: Area;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mapData: MapDataProvider,
    private navigator: LaunchNavigator,
    private alertCtrl: TranslateAlertController,
  ) {
    this.navParams.get('params').subscribe(({ area, org, products }) => {
      if (this.area !== area && area) {
        this.mapData.getPois(area.orgid)
          .then(pois => this.options.pois = pois)
          .catch(() => this.options.pois = [])
          .then(() => this.options = Object.assign({}, this.options));

        this.mapData.getPolygons(area.orgid)
          .then(polygons => this.options.polygons = polygons)
          .catch(() => this.options.polygons = [])
          .then(() => this.options = Object.assign({}, this.options));

        this.options.area = area;
        this.options = Object.assign({}, this.options);
      }
      this.area = area;
    });
  }

  popupOpen(evt) {
    this.navigateTo = evt.popup.getLatLng();
    this.navigateTo.title = evt.popup.options.title;
    this.showNavigate = 'show';
  }

  popupClose(evt) {
    this.navigateTo = undefined;
    this.showNavigate = 'hide';
  }

  navigate() {
    this.navigator.navigate(
      [this.navigateTo.lat, this.navigateTo.lng],
      { destinationName: this.navigateTo.title },
    ).then(() => {
      console.log('Opening navigator');
    }, error => {
      if (!isDevMode()) {
        Sentry.getSharedClient().captureException(error);
      }
      if (error === 'cancelled') {
        return;
      }
      this.alertCtrl.show({
        title: 'Error',
        message: error,
      });
    });
  }
}
