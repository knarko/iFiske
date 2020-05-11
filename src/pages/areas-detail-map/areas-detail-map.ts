import { Component } from '@angular/core';
import {
  transition,
  style,
  animate,
  state,
  trigger,
} from '@angular/animations';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapOptions } from '../../components/map/map';
import { MapDataProvider } from '../../providers/map-data/map-data';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import { Area, AreaProvider } from '../../providers/area/area';
import { MonitoringClient } from '../../app/monitoring';
import { isProdMode } from '../../app/config';
import { Observable } from 'rxjs/Observable';
import { AreaDetailParams } from '../areas-detail/areas-detail-params';

@IonicPage()
@Component({
  selector: 'page-areas-detail-map',
  templateUrl: 'areas-detail-map.html',
  animations: [
    trigger('showNavigate', [
      state('show', style({ transform: 'rotate(45deg) scale(1)' })),
      state('hide', style({ transform: 'rotate(-120deg) scale(0)' })),
      transition(
        'show => hide',
        animate('.3s cubic-bezier(0.68, -0.55, 0.27, 1)'),
      ),
      transition(
        'hide => show',
        animate('.3s cubic-bezier(0.68, 0, 0.27, 1.55)'),
      ),
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

  area: Area;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private mapData: MapDataProvider,
    private navigator: LaunchNavigator,
    private alertCtrl: TranslateAlertController,
    private areaProvider: AreaProvider,
  ) {
    const params: Observable<AreaDetailParams> =
      this.navParams.get('params') ||
      ((this.navCtrl as any).rootParams &&
        (this.navCtrl as any).rootParams.params);
    params.subscribe(({ area }) => {
      if (this.area !== area && area) {
        this.mapData
          .getPois(area.orgid)
          .then((pois) => (this.options.pois = pois))
          .catch(() => (this.options.pois = []))
          .then(() => (this.options = Object.assign({}, this.options)));

        this.mapData
          .getPolygons(area.orgid)
          .then((polygons) => (this.options.polygons = polygons))
          .catch(() => (this.options.polygons = []))
          .then(() => (this.options = Object.assign({}, this.options)));

        this.areaProvider
          .getLayers(area.ID)
          .then((layers) => (this.options.layers = layers))
          .catch(() => (this.options.layers = []))
          .then(() => (this.options = Object.assign({}, this.options)));

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

  popupClose() {
    this.navigateTo = undefined;
    this.showNavigate = 'hide';
  }

  navigate() {
    this.navigator
      .navigate([this.navigateTo.lat, this.navigateTo.lng], {
        destinationName: this.navigateTo.title,
      })
      .then(
        () => {
          console.log('Opening navigator');
        },
        (error) => {
          if (isProdMode()) {
            MonitoringClient.captureException(error);
          }
          if (error === 'cancelled') {
            return;
          }
          this.alertCtrl.show({
            title: 'Error',
            message: error,
          });
        },
      );
  }
}
