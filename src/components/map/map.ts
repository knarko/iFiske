import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { Map, TileLayer, Control, LayerGroup, Popup, Icon, Marker, Polygon } from 'leaflet';
import * as LocateControl from 'leaflet.locatecontrol';
import { MapDataProvider } from '../../providers/map-data/map-data';
import { serverLocation } from '../../providers/api/serverLocation';

import 'leaflet.markercluster';
import 'drmonty-leaflet-awesome-markers';
declare var L: any;


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
  areaMarker: LayerGroup;
  polygons: LayerGroup;
  map: Map;
  markers: any;
  icons: any;
  lc: any;

  text: string;
  @ViewChild('map') mapElement: ElementRef;

  @Output('popupopen') popupopen = new EventEmitter();
  @Output('popupclose') popupclose = new EventEmitter();

  @Input() options: any;
  constructor(private mapData: MapDataProvider) {
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
      onLocationError: function (err) {
        console.error(err);
        // TODO: Raven
        // Raven.captureException(err);
      },
      onLocationOutsideMapBounds: function (context) {
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

    this.markers = new L.MarkerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 9,
      chunkedLoading: true,
      removeOutsideVisibleBounds: true,
      spiderfyOnMaxZoom: false,
      maxClusterRadius: 60,
    });
    this.map.addLayer(this.markers);

    var poiMarkers = new LayerGroup();
    this.map.addLayer(poiMarkers);

    this.polygons = new LayerGroup();
    this.map.addLayer(this.polygons);

    this.areaMarker = new LayerGroup();
    this.map.addLayer(this.areaMarker);

    this.map.on('popupopen', e => {
      this.popupopen.emit(e);
    });
    this.map.on('popupclose', e => {
      this.popupclose.emit(e);
    });
  }

  createAreaPopup(area) {
    return new Popup({
      closeButton: false,
      maxWidth: window.innerWidth - 50,
      // TODO: bind popup
    }).setContent(`<a class="center"
                            ui-sref="app.area.info({id: popup.area.ID})"
                            ng-bind="popup.area.t"
                        ></a>
                    `);
  }

  createIcons() {
    if (this.icons) {
      return Promise.resolve(this.icons);
    }
    return this.mapData.getPoiTypes()
      .then(function (poiTypes) {
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

  createMarkers(areas) {
    var newMarkers = [];
    for (var i = 0; i < areas.length; ++i) {
      var a = areas[i];
      var marker = new Marker({
        // layer:           'areas',
        lat: a.lat,
        lng: a.lng,
      }, {
          title: a.ID,

          icon: L.AwesomeMarkers.icon({
            icon: a.favorite ? 'star' : '',
            // eslint-disable-next-line no-nested-ternary
            markerColor: a.wsc ? (a.favorite ? 'orange' : 'darkblue') : 'lightgray',
            prefix: 'ion',
          }),
        });
      marker.bindPopup(this.createAreaPopup(a));
      newMarkers.push(marker);
    }
    this.markers.clearLayers();
    this.markers.addLayers(newMarkers);
  }

  createPois(pois) {
    this.createIcons().then(function (icons) {
      this.poiMarkers.clearLayers();
      for (var i = 0; i < pois.length; ++i) {
        var poi = pois[i];

        var marker = new Marker({
          lat: poi.la,
          lng: poi.lo,
        }, {
            icon: icons[poi.type],
          });
        marker.bindPopup('<h4>' + poi.t + '</h4><p>' + poi.d + '</p>', {
          maxWidth: window.innerWidth - 50,
          // TODO: readd this
          // title:    poi.t,
        });
        this.poiMarkers.addLayer(marker);
      }
    });
  }


  createPolygons(polys) {
    this.polygons.clearLayers();
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
    this.areaMarker.clearLayers();
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
    if (!data || !data.options || !this.options) {
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
