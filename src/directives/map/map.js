angular.module('ifiske.directives')
  .directive('ifiskeMap', function() {
    return {
      restrict:    'E',
      transclude:  false,
      templateUrl: 'directives/map/map.html',

      scope: {
        mapData: '=',
      },
      controller: function(
        $scope,
        $timeout,
        localStorage,
        $element,
        $window,
        MapData,
        serverLocation,
        $q,
      ) {
        console.log('starting a map');
        // eslint-disable-next-line max-len
        const mapboxUrl = 'https://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
        const apikey = localStorage.get('mapbox_api');

        const map = $window.L.map($element.find('div')[0]).setView([62.0, 15.0], 4);
        $window.map = map;
        const baseLayers = {
          outdoors: $window.L.tileLayer(mapboxUrl, {
            maxZoom: 18,
            maptype: 'mapbox.outdoors',
            apikey:  apikey,
          }),
          satellite: $window.L.tileLayer(mapboxUrl, {
            maxZoom: 16,
            maptype: 'mapbox.satellite',
            apikey:  apikey,
          }),
        };
        map.addLayer(baseLayers.outdoors);

        $window.L.control.layers(baseLayers).addTo(map);

        $scope.$parent.$on('$ionicParentView.afterEnter', function() {
          console.log('Map: entered, invalidating map size');
          map.invalidateSize();
        });

        const lc = new $window.L.control.locate({ // eslint-disable-line new-cap
          follow:               false,
          position:             'bottomright',
          keepCurrentZoomLevel: false,
          stopFollowingOnDrag:  true,
          remainActive:         true,
          onLocationError:      function(err) {
            console.error(err);
            Raven.captureException(err);
          },
          onLocationOutsideMapBounds: function(context) {
            console.log(context);
          },
          locateOptions: {
            watch:   true, // Watch is broken in chrome
            maxZoom: 14,
          },
          icon:        'icon ion-android-locate',
          iconLoading: 'icon ion-load-a spin',

        });

        lc.addTo(map);

        const markers = $window.L.markerClusterGroup({
          showCoverageOnHover:        false,
          disableClusteringAtZoom:    9,
          chunkedLoading:             true,
          removeOutsideVisibleBounds: true,
          spiderfyOnMaxZoom:          false,
          maxClusterRadius:           60,
        });
        map.addLayer(markers);

        const poiMarkers = $window.L.layerGroup();
        map.addLayer(poiMarkers);

        const polygons = $window.L.layerGroup();
        map.addLayer(polygons);

        const areaMarker = $window.L.layerGroup();
        map.addLayer(areaMarker);

        map.on('popupopen', function(e) {
          $scope.$emit('leaflet.popupopen', e);
        });
        map.on('popupclose', function(e) {
          $scope.$emit('leaflet.popupclose', e);
        });

        function createAreaPopup(area) {
          return $window.L.popup.angular({
            closeButton: false,
            maxWidth:    $window.innerWidth - 50,
            template:    `
                            <a class="center"
                                ui-sref="app.area.info({id: popup.area.ID})"
                                ng-bind="popup.area.t"
                            ></a>
                        `,
            controllerAs: 'popup',
            controller:   function() {
              this.area = area;
            },
          });
        }

        let icons;
        function createIcons() {
          if (icons) {
            return $q.when(icons);
          }
          return MapData.getPoiTypes()
            .then(function(poiTypes) {
              icons = {};
              for (let i = 0; i < poiTypes.length; ++i) {
                const type = poiTypes[i];
                icons[type.ID] = $window.L.icon({
                  iconUrl:     serverLocation + type.icon,
                  iconAnchor:  [16, 37], // point of the icon which will correspond to marker's location
                  popupAnchor: [0, -35],
                });
              }
              return icons;
            });
        }

        function createMarkers(areas) {
          const newMarkers = [];
          for (let i = 0; i < areas.length; ++i) {
            const a = areas[i];
            const marker = $window.L.marker({
              // layer:           'areas',
              lat: a.lat,
              lng: a.lng,
            }, {
              title: a.ID,

              icon: $window.L.AwesomeMarkers.icon({
                icon:        a.favorite ? 'star' : '',
                // eslint-disable-next-line no-nested-ternary
                markerColor: a.wsc ? (a.favorite ? 'orange' : 'blue') : 'lightgray',
                prefix:      'ion',
              }),
            });
            marker.bindPopup(createAreaPopup(a));
            newMarkers.push(marker);
          }
          markers.clearLayers();
          markers.addLayers(newMarkers);
        }

        function createPois(pois) {
          createIcons().then(function(icons) {
            poiMarkers.clearLayers();
            for (let i = 0; i < pois.length; ++i) {
              const poi = pois[i];

              const marker = $window.L.marker({
                lat: poi.la,
                lng: poi.lo,
              }, {
                icon: icons[poi.type],
              });
              marker.bindPopup('<h4>' + poi.t + '</h4><p>' + poi.d + '</p>', {
                maxWidth: $window.innerWidth - 50,
                title:    poi.t,
              });
              poiMarkers.addLayer(marker);
            }
          });
        }

        function createPolygons(polys) {
          polygons.clearLayers();
          for (let i = 0; i < polys.length; ++i) {
            const poly = polys[i];
            polygons.addLayer($window.L.polygon(JSON.parse('[' + poly.poly + ']'), {
              color:     poly.c,
              weight:    2,
              opacity:   0.5,
              fillColor: poly.c,
            }));
          }
        }

        function createArea(area) {
          areaMarker.clearLayers();
          const marker = $window.L.marker({
            lat: area.lat,
            lng: area.lng,
          });
          marker.bindPopup(area.t);
          areaMarker.addLayer(marker);

          console.log(map, area);
          $timeout(() => {
            map.setView({
              lat: area.lat,
              lng: area.lng,
            });
          });

          map.setZoom(Number(area.zoom) ? Number(area.zoom) : 9, {
            animate: false,
          });
        }

        $scope.$watch('mapData', function(data) {
          if (!data) {
            return;
          }
          console.log(data);
          if (data.centerOnMe && !lc._active) {
            $timeout(function() {
              lc.start();
            }, 0);
          }
          if (data.areas) {
            createMarkers(data.areas);
          }
          if (data.pois) {
            createPois(data.pois);
          }
          if (data.polygons) {
            createPolygons(data.polygons);
          }
          if (data.area) {
            createArea(data.area);
          }
        }, true);
      },
    };
  });
