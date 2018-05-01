import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
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
  icons: any;
  @Output('popupOpen') popupOpen = new EventEmitter();
  @Output('popupClose') popupClose = new EventEmitter();

  @Input() options: MapOptions;

  @ViewChild('map') mapElement: ElementRef;
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
  private pois: mapboxgl.Marker[] = [];

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

  private initializeMap = () => {
    console.log('map loaded');
    this.addAreasToMap();
    if (this.shouldRefresh) {
      this.refresh()
      this.shouldRefresh = false;
    }
  }

  swapMapStyle() {
    this.shouldRefresh = true;
    this.map.setStyle(this.mapStyles.next().value);
    this.map.once('styledata', () => {
      console.log('updated style');
      this.addAreasToMap();
      this.refresh();
    })
  }

  private addAreasToMap() {
    console.log(this.map);
    this.map.addSource('areas', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 9,
      clusterRadius: 30,
    });
    this.map.addLayer({
      id: 'areas-cluster',
      type: 'circle',
      source: 'areas',
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          colors.primary,
          100,
          colors.secondary,
          750,
          colors.gold,
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          100,
          30,
          750,
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
        this.map.flyTo({ center: cluster[0].geometry.coordinates, zoom: cluster[0].properties.zoom });
      }
    });

    this.map.addLayer({
      id: 'areas',
      type: "circle",
      source: "areas",
      filter: ["!has", "point_count"],
      paint: {
        "circle-color": colors.primary,
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });
  }

  async createIcons() {
    const poiTypes = await this.mapData.getPoiTypes();
    this.icons = poiTypes.reduce((acc, type, index, arr) => {
      acc[type.ID] =`${serverLocation}${type.icon}`;
      return acc;
    }, {});
  }

  createMarkers(areas: Area[]) {
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
            title: area.t,
            id: area.ID,
            zoom: Number(area.zoom) || 8, // Some areas have zoom set to 0, which is super-ugly
          },
        };
      }),
    };

    const source = this.map.getSource('areas') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(data);
    }

    // TODO: re-add different colors
    /*
    icon: a.favorite ? 'star' : '',
    // eslint-disable-next-line no-nested-ternary
    markerColor: a.wsc ? (a.favorite ? 'orange' : 'darkblue') : 'lightgray',
    prefix: `ion-${this.platform.cssClass}`,
    extraClasses: 'ion-icon',
    */
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
    this.pois.forEach(poi => poi.remove());
    this.pois = pois.map(poi => {
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
    /*

    for (var i = 0; i < polys.length; ++i) {
      var poly = polys[i];
      this.polygons.addLayer(new Polygon(JSON.parse('[' + poly.poly + ']'), {
        color: poly.c,
        weight: 2,
        opacity: 0.5,
        fillColor: poly.c,
      }));
    }
    */
  }

  createArea(area: Area) {
    const marker = this.createMarker({class: 'marker-area', lngLat: [1,1]});
    marker.setPopup(new mapboxgl.Popup().setText(area.t));
    marker.addTo(this.map);
    this.map.flyTo({center: [area.lng, area.lat], animate: false, zoom: Number(area.zoom) || 9});
  }

  ngOnChanges(data) {
    if (!this.map || !this.map.loaded) {
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

    if (this.options.centerOnMe) {
      // TODO: this zooms in too much
      // (this.lc as any).trigger();
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
