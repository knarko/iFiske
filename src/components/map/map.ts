import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MapDataProvider } from '../../providers/map-data/map-data';
import { serverLocation } from '../../providers/api/serverLocation';
import { Area } from '../../providers/area/area';
import { POI, FiskePolygon } from '../../providers/map-data/map-data';

import { PlatformProvider } from '../../providers/platform/platform';
import { TranslateService } from '@ngx-translate/core';
import { MonitoringClient } from '../../app/monitoring';

import * as mapboxgl from 'mapbox-gl';
import { GeoJSON, Feature, Point, Polygon } from 'geojson'
import { NavController } from 'ionic-angular';
import { colors } from '../../app/config';

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
export class MapComponent implements AfterViewInit {
  initialized: boolean;
  @Output('popupOpen') popupOpen = new EventEmitter();
  @Output('popupClose') popupClose = new EventEmitter();

  @Input() set areas(areas: Area[]) {
    this.queue(() => this.updateAreas(areas || undefined));
  };

  @Input() set centerOnMe(centerOnMe: boolean) {}
  @Input() set pois(value: POI[]) {}
  @Input() set polygons(value: FiskePolygon[]) {}
  @Input() set area(value: Area) {}

  @ViewChild('map') mapElement: ElementRef;

  private _queue: any[] = [];
  private queue(fn: any) {
    this._queue.push(fn);
    if (this.initialized) {
      setTimeout(() => this.runQueue());
    }
  }
  private runQueue() {
    this._queue.forEach(fn => {
      setTimeout(fn);
    });
    this._queue = [];
  }

  private mapStyles = function* mapStyles() {
    const styles = [
      'mapbox://styles/mapbox/outdoors-v10',
      'mapbox://styles/mapbox/satellite-streets-v10',
    ];
    let i = 0;
    while (true) {
      yield styles[i];
      i = (i + 1) % styles.length;
    }
  }();

  private map: mapboxgl.Map;
  private lc: mapboxgl.GeolocateControl;
  private shouldRefresh: boolean;
  private poiMarkers: mapboxgl.Marker[];
  icons: any;

  constructor(
    private mapData: MapDataProvider,
    private navCtrl: NavController,
    private platform: PlatformProvider,
    private translate: TranslateService,
  ) { }

  ngAfterViewInit() {
    (mapboxgl.accessToken as any) = localStorage.getItem('mapbox_api');

    this.map = new mapboxgl.Map({
      attributionControl: false,
      container: this.mapElement.nativeElement,
      style: this.mapStyles.next().value,
      center: [15.0, 62.0],
      zoom: 3,
    });

    this.lc = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
    });

    this.map.addControl(this.lc, 'bottom-right');

    this.map.on('popupopen', e => {
      this.map.getContainer().classList.add('popup-open');
      this.popupOpen.emit(e);
    });
    this.map.on('popupclose', e => {
      this.map.getContainer().classList.remove('popup-open');
      this.popupClose.emit(e);
    });

    this.map.on('load', this.initializeMap);
  }

  private initializeMap = async () => {
    console.log('initializing');
    const icons = [{
      url: '/assets/pins/pin-primary.png',
      name: 'pin-primary',
    }, {
      url: '/assets/pins/pin-star.png',
      name: 'pin-star',
    }, {
      url: '/assets/pins/pin-empty.png',
      name: 'pin-empty',
    }];
    await Promise.all(icons.map(icon => {
      return new Promise((resolve, reject) => {
        console.log('in promise');
        this.map.loadImage(icon.url, (error, image) => {
          console.log('image loaded');
          if (error) {
            console.warn(error);
            return reject(error);
          }
          this.map.addImage(icon.name, image, {
            width: 128,
            height: 128,
            pixelRatio: 4,
          });
          resolve();
        });
      });
    }));
    console.log('initialized');
    this.initialized = true;
    this.runQueue();
  }

  swapMapStyle() {
    this.shouldRefresh = true;
    this.map.setStyle(this.mapStyles.next().value);
    this.map.once('styledata', () => {
      console.log('updated style');
    })
  }

  private updateAreas(areas: Area[] = []) {
    console.log(areas);
    const sourceName = 'areas';
    let source: mapboxgl.GeoJSONSource = this.map.getSource(sourceName) as any;

    if (!source) {
      this.map.addSource(sourceName, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
        cluster: true,
        clusterMaxZoom: 7,
        clusterRadius: 30,
      });

      source = this.map.getSource(sourceName) as any;

      this.map.addLayer({
        id: 'areas-cluster',
        type: 'circle',
        source: 'areas',
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * 20px circles when point count is less than 100
          //   * 30px circles when point count is greater than 100
          "circle-color": colors.primary,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
          ],
        },
      });

      this.map.addLayer({
        id: 'areas-count',
        type: 'symbol',
        source: 'areas',
        filter: ["has", "point_count"],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#FFFFFF',
        },
      });

      this.map.on('click', 'areas-cluster', e => {
        this.map.flyTo({ center: e.lngLat, zoom: this.map.getZoom() + 1 })
      });

      this.map.on('click', 'areas', e => {
        const cluster = this.map.queryRenderedFeatures(e.point, { layers: ['areas'] }) as any;
        if (cluster[0] && cluster[0].properties && !cluster[0].properties.cluster) {
          console.log(cluster[0].properties);
          const mapHeight = this.map.getCanvas().getBoundingClientRect().height;
          this.map.flyTo({
            center: cluster[0].geometry.coordinates,
            zoom: cluster[0].properties.zoom,
            offset: [0, (mapHeight / -4)],
          });
        }
      });

      this.map.addLayer({
        id: 'areas',
        type: "symbol",
        source: "areas",
        filter: ["!has", "point_count"],
        layout: {
          'icon-image': '{icon}',
          'icon-size': 1.5,
          'icon-offset': [0, -16],
          'icon-allow-overlap': true,
        },
        paint: {
          'icon-halo-color': 'rgba(255,255,255, 0.5)',
          'icon-halo-width': 1,
        },
      });
    }
    const data: GeoJSON.FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: areas.map(area => {
        return {
          type: 'Feature' as 'Feature',
          geometry: {
            type: 'Point' as 'Point',
            coordinates: [area.lng, area.lat],
          },
          properties: {
            icon: area.favorite ? 'pin-star': (area.wsc ? 'pin-primary' : 'pin-empty'),
            title: area.t,
            id: area.ID,
            zoom: Number(area.zoom) || 8, // Some areas have zoom set to 0, which is super-ugly
          },
        };
      }),
    };

    source.setData(data);
  }

  async createIcons() {
    const poiTypes = await this.mapData.getPoiTypes();
    this.icons = poiTypes.reduce((acc, type, index, arr) => {
      acc[type.ID] =`${serverLocation}${type.icon}`;
      return acc;
    }, {});
  }


  private createMarker(opts: {image?: string, class?: string, lngLat: number[]}) {
    const el = document.createElement('div');
    el.className = opts.class;
    if (opts.image) {
      el.style.backgroundImage = `url('${opts.image}')`;
    }
    const marker = new mapboxgl.Marker(el);
    marker.setLngLat(opts.lngLat);
    return marker;
  }

  async createPois(pois: POI[]) {
    await this.createIcons();
    this.poiMarkers.forEach(poi => poi.remove());
    this.poiMarkers = pois.map(poi => {
          const marker = this.createMarker({
            image: this.icons[poi.type],
            class: 'marker-poi',
            lngLat: [poi.lo, poi.la],
          });
      const popup = new mapboxgl.Popup({anchor: 'bottom', offset: 25}).setHTML(`<h4>${poi.t}</h4><p>${poi.d}`);
      popup.on('open', () => {
        const mapHeight = this.map.getCanvas().getBoundingClientRect().height;
        this.map.panTo(marker.getLngLat(), { offset: [0, (mapHeight / 2) - 35]});
      });
      marker.setPopup(popup);
      marker.addTo(this.map);
      return marker;
    })
  }


  createPolygons(polygons: FiskePolygon[]) {
    console.log(polygons);
    const data: GeoJSON.FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features: polygons.map(poly => {
        const coordinates = JSON.parse(`[${poly.poly}]`).map(coord => [coord[1], coord[0]]);
        return {
          type: 'Feature' as 'Feature',
          geometry: {
            type: 'Polygon' as 'Polygon',
            coordinates: [coordinates],
          },
          properties: {
            color: poly.c,
            title: poly.t,
          },
        };
      }),
    };
    console.log(data);
    if (this.map.getLayer('polygons')) {
      return;
    }
    this.map.addLayer({
      id: 'polygons',
      type: 'fill',
      source: {
        type: 'geojson',
        data,
      },
      layout: {},
      paint: {
        'fill-color': ['get', 'color'],
        'fill-outline-color': 'black',
        'fill-opacity': 0.5,
      },
    });
  }

  createArea(area: Area) {
    this.map.flyTo({center: [area.lng, area.lat], animate: false, zoom: Number(area.zoom) || 9});
    const marker = this.createMarker({class: 'map-pin', lngLat: [area.lng, area.lat]});
    const popup = new mapboxgl.Popup();
    popup.setText(area.t);
    popup.on('open', () => {
      this.map.flyTo({center: [area.lng, area.lat], animate: false, zoom: Number(area.zoom) || 9});
    });
    marker.setPopup(popup);
    marker.addTo(this.map);
  }
}
