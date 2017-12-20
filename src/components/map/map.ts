import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { Map, TileLayer, Control, LayerGroup, Popup, Icon, Marker, Polygon } from 'leaflet';
import * as LocateControl from 'leaflet.locatecontrol';
import { MapDataProvider } from '../../providers/map-data/map-data';
import { serverLocation } from '../../providers/api/serverLocation';
import { Area } from '../../providers/area/area';
import { POI, FiskePolygon } from '../../providers/map-data/map-data';

import 'leaflet.markercluster';
import 'drmonty-leaflet-awesome-markers';
import { NavController } from 'ionic-angular';
import { PlatformProvider } from '../../providers/platform/platform';
declare var L: any;


export interface MapOptions {
  areas?: Area[];
  centerOnMe?: boolean;
  pois?: POI[];
  polygons?: FiskePolygon[];
  area?: Area;
}


/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map',
  templateUrl: 'map.html',
})
export class MapComponent implements AfterViewInit, OnChanges {
  poiMarkers: LayerGroup;
  areaMarker: LayerGroup;
  polygons: LayerGroup;
  map: Map;
  markers: any;
  icons: any;
  lc: any;

  shouldRefresh = false;

  text: string;
  @ViewChild('map') mapElement: ElementRef;

  @Output('popupOpen') popupOpen = new EventEmitter();
  @Output('popupClose') popupClose = new EventEmitter();

  @Input() options: MapOptions;
  constructor(
    private mapData: MapDataProvider,
    private navCtrl: NavController,
    private platform: PlatformProvider,
  ) {
  }

  ngAfterViewInit() {
    var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
    var apikey = localStorage.getItem('mapbox_api');

    this.map = new Map(this.mapElement.nativeElement)
      .setView([62.0, 15.0], 4);

    var baseLayers = {
      outdoors: new TileLayer(mapboxUrl, {
        maxZoom: 18,
        maptype: 'mapbox.outdoors',
        apikey: apikey,
      }),
      satellite: new TileLayer(mapboxUrl, {
        maxZoom: 16,
        maptype: 'mapbox.satellite',
        apikey: apikey,
      }),
    };

    this.map.addLayer(baseLayers.outdoors);

    this.map.addControl(new Control.Layers(baseLayers));

    this.lc = new LocateControl({ // eslint-disable-line new-cap
      follow: false,
      position: 'bottomright',
      keepCurrentZoomLevel: false,
      stopFollowingOnDrag: true,
      remainActive: true,
      onLocationError: (err) => {
        console.error(err);
        // TODO: Raven
        // Raven.captureException(err);
      },
      onLocationOutsideMapBounds: context => {
        console.log(context);
      },
      locateOptions: {
        watch: true, // Watch is broken in chrome
        maxZoom: 14,
      },
      icon: 'locate-icon icon ion-md-locate',
      iconLoading: 'icon locate-icon ion-md-refresh spin',

    });

    this.lc.addTo(this.map);


    this.map.on('popupopen', e => {
      this.map.getContainer().classList.add('popup-open');
      this.popupOpen.emit(e);
    });
    this.map.on('popupclose', e => {
      this.map.getContainer().classList.remove('popup-open');
      this.popupClose.emit(e);
    });

    if (this.shouldRefresh) {
      this.refresh()
      this.shouldRefresh = false;
    }
  }

  createAreaPopup(area) {
    const popup = new Popup({
      closeButton: false,
      maxWidth: window.innerWidth - 50,
    });

    const div = document.createElement('div');
    div.appendChild(document.createTextNode(area.t));
    div.addEventListener('click', () => {
      this.navCtrl.push('AreasDetailPage', area);
    });

    popup.setContent(div);

    return popup;
  }

  createIcons() {
    if (this.icons) {
      return Promise.resolve(this.icons);
    }
    return this.mapData.getPoiTypes()
      .then(poiTypes => {
        this.icons = {};
        for (var i = 0; i < poiTypes.length; ++i) {
          var type = poiTypes[i];
          this.icons[type.ID] = new Icon({
            iconUrl: serverLocation + type.icon,
            iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -35],
          });
        }
        return this.icons;
      });
  }

  createMarkers(areas: Area[]) {
    if (this.markers) {
      this.markers.clearLayers();
    } else {
      this.markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false,
        disableClusteringAtZoom: 9,
        chunkedLoading: true,
        removeOutsideVisibleBounds: true,
        spiderfyOnMaxZoom: false,
        maxClusterRadius: 60,
      });
      this.map.addLayer(this.markers);
    }

    var newMarkers = [];
    for (var i = 0; i < areas.length; ++i) {
      var a = areas[i];
      var marker = new Marker({
        // layer:           'areas',
        lat: a.lat,
        lng: a.lng,
      }, {
          title: a.t,

          icon: L.AwesomeMarkers.icon({
            icon: a.favorite ? 'star' : '',
            // eslint-disable-next-line no-nested-ternary
            markerColor: a.wsc ? (a.favorite ? 'orange' : 'darkblue') : 'lightgray',
            prefix: `ion-${this.platform.cssClass}`,
            extraClasses: 'ion-icon',
          }),
        });
      marker.bindPopup(this.createAreaPopup(a));
      newMarkers.push(marker);
    }
    this.markers.addLayers(newMarkers);
  }

  createPois(pois: POI[]) {
    if (this.poiMarkers) {
      this.poiMarkers.clearLayers();
    } else {
      this.poiMarkers = new LayerGroup();
      this.map.addLayer(this.poiMarkers);
    }
    this.createIcons().then(icons => {
      for (var i = 0; i < pois.length; ++i) {
        var poi = pois[i];

        var marker = new Marker({
          lat: poi.la,
          lng: poi.lo,
        }, {
            icon: icons[poi.type],
            title: poi.t,
          });
        marker.bindPopup('<h4>' + poi.t + '</h4><p>' + poi.d + '</p>', {
          maxWidth: window.innerWidth - 50,
        });
        this.poiMarkers.addLayer(marker);
      }
    });
  }


  createPolygons(polys: FiskePolygon[]) {
    console.log(polys);
    if (this.polygons) {
      this.polygons.clearLayers();
    } else {
      this.polygons = new LayerGroup();
      this.map.addLayer(this.polygons);
    }

    for (var i = 0; i < polys.length; ++i) {
      var poly = polys[i];
      this.polygons.addLayer(new Polygon(JSON.parse('[' + poly.poly + ']'), {
        color: poly.c,
        weight: 2,
        opacity: 0.5,
        fillColor: poly.c,
      }));
    }
  }

  createArea(area) {
    console.log(this);
    if (this.areaMarker) {
      this.areaMarker.clearLayers();
    } else {
      this.areaMarker = new LayerGroup();
      this.map.addLayer(this.areaMarker);
    }
    var marker = new Marker({
      lat: area.lat,
      lng: area.lng,
    });
    marker.bindPopup(area.t);
    this.areaMarker.addLayer(marker);

    console.log(this.map, area);
    setTimeout(() => {
      this.map.setView({
        lat: area.lat,
        lng: area.lng,
      }, Number(area.zoom) ? Number(area.zoom) : 9);
    });
  }

  ngOnChanges(data) {
    if (!this.map) {
      this.shouldRefresh = true;
      return;
    }
    this.refresh();
  }
  refresh() {
    console.log(this.options);
    if (!this.options) {
      return;
    }
    if (this.options.centerOnMe && !this.lc._active) {
      setTimeout(() => {
        this.lc.start();
      }, 0);
    }
    if (this.options.areas) {
      this.createMarkers(this.options.areas);
    }
    if (this.options.pois) {
      this.createPois(this.options.pois);
    }
    if (this.options.polygons) {
      this.createPolygons(this.options.polygons);
    }
    if (this.options.area) {
      this.createArea(this.options.area);
    }
  }

}
