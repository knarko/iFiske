import { Component } from '@angular/core';
import { transition, style, animate, state, trigger } from '@angular/animations';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapOptions } from '../../components/map/map';
import { MapDataProvider } from '../../providers/map-data/map-data';

/**
 * Generated class for the AreasDetailMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-areas-detail-map',
  templateUrl: 'areas-detail-map.html',
  animations: [
    trigger('showNavigate', [
    state('show', style({transform: 'rotate(45deg) scale(1)'})),
    state('hide', style({transform: 'rotate(-120deg) scale(0)'})),
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
  showNavigate: 'show'|'hide' = 'hide';

  options: MapOptions = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, private mapData: MapDataProvider) {
    this.navParams.get('params').subscribe(({ area, org, products }) => {
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
    (window as any).launchnavigator.navigate(
      [this.navigateTo.lat, this.navigateTo.lng],
      {
        successCallback: () => {
          console.log('Opening navigator');
        },
        errorCallback: error => {
          // TODO: Raven
          // Raven.captureException(error);
          if (error === 'cancelled') {
            return;
          }
          /*
          $ionicPopup.alert({
            title: $translate.instant('Error'),
            template: $translate.instant('Unknown error', { error }),
          });
          */
        },
        destinationName: this.navigateTo.title,
      });
  }
}
