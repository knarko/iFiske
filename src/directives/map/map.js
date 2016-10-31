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
            localStorage,
            $translate,
            MapData,
            serverLocation,
            $q
        ) {
            // eslint-disable-next-line max-len
            var mapboxUrl = 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
            var apikey = localStorage.get('mapbox_api');

            var lc = new window.L.control.locate({ // eslint-disable-line new-cap
                follow:               false,
                position:             'bottomright',
                keepCurrentZoomLevel: false,
                stopFollowingOnDrag:  true,
                remainActive:         true,
                onLocationError:      function(err) {
                    console.error(err);
                },
                onLocationOutsideMapBounds: function(context) {
                    console.log(context);
                },
                locateOptions: {
                    maxZoom: 14,
                },
                icon: 'icon ion-android-locate',

            });

            var overlayParams = {
                showOnSelector:             false,
                disableClusteringAtZoom:    9,
                chunkedLoading:             true,
                showCoverageOnHover:        false,
                removeOutsideVisibleBounds: true,
            };

            angular.extend($scope, {
                map: {
                    paths:   {},
                    markers: {},
                    layers:  {
                        baselayers: {
                            outdoors: {
                                name:         $translate.instant('Outdoors'),
                                type:         'xyz',
                                url:          mapboxUrl,
                                layerOptions: {
                                    maptype: 'mapbox.outdoors',
                                    apikey:  apikey,
                                },
                            },
                            satellite: {
                                name:         $translate.instant('Satellite'),
                                type:         'xyz',
                                url:          mapboxUrl,
                                layerOptions: {
                                    maptype: 'mapbox.satellite',
                                    apikey:  apikey,
                                },
                            },
                        },
                        overlays: {
                            areas: {
                                name:        'Fiskeområden',
                                type:        'markercluster',
                                visible:     true,
                                layerParams: overlayParams,
                            },
                            pois: {
                                name:        'Pois',
                                type:        'markercluster',
                                visible:     true,
                                layerParams: overlayParams,
                            },
                        },
                    },
                    center: {
                        lat:  62.0,
                        lng:  15.0,
                        zoom: 9,
                    },
                    controls: {
                        custom: [
                            lc,
                        ],
                    },
                },
            });

            function createscope(a) {
                return function() {
                    var scope = $scope.$new();
                    scope.area = a;
                    console.log(a);
                    return scope;
                };
            }

            var icons;
            function createIcons() {
                if (icons) {
                    return $q.when(icons);
                }
                return MapData.getPoiTypes()
                .then(function(poiTypes) {
                    icons = {};
                    for (var i = 0; i < poiTypes.length; ++i) {
                        var type = poiTypes[i];
                        icons[type.ID] = {
                            iconUrl:     serverLocation + type.icon,
                            iconAnchor:  [16, 37], // point of the icon which will correspond to marker's location
                            popupAnchor: [0, -35],
                        };
                    }
                });
            }

            function createMarkers(areas) {
                for (var i = 0; i < areas.length; ++i) {
                    var a = areas[i];
                    $scope.map.markers['area_' + i] = {
                        layer:           'areas',
                        lat:             a.lat,
                        lng:             a.lng,
                        getMessageScope: createscope(a), // TODO: dont create multiple scopes

                        message: '<a ui-sref="app.area.info({id: area.ID })" ng-bind="area.t"></a>',
                        icon:    {
                            type:        'awesomeMarker',
                            icon:        a.favorite ? 'star' : '',
                            // eslint-disable-next-line no-nested-ternary
                            markerColor: a.wsc ? (a.favorite ? 'orange' : 'blue') : 'lightgray',
                            prefix:      'ion',
                        },
                    };
                }
            }

            function createPois(pois) {
                createIcons().then(function() {
                    for (var i = 0; i < pois.length; ++i) {
                        var poi = pois[i];

                        $scope.map.markers['poi_' + i] = {
                            layer:        'pois',
                            lat:          poi.la,
                            lng:          poi.lo,
                            icon:         icons[poi.type],
                            message:      '<h4>' + poi.t + '</h4><p>' + poi.d + '</p>',
                            popupOptions: {
                                maxWidth: window.innerWidth - 50,
                            },
                        };
                    }
                });
            }

            function createPolygons(polygons) {
                $scope.map.paths = polygons.map(function(poly) {
                    return {
                        latlngs:   JSON.parse('[' + poly.poly + ']'),
                        color:     poly.c,
                        weight:    2,
                        opacity:   0.5,
                        fillColor: poly.c,
                        type:      'polygon',
                    };
                });
            }

            function createArea(area) {
                $scope.map.markers.area = {
                    layer:   'pois',
                    lat:     area.lat,
                    lng:     area.lng,
                    message: area.t,
                };
                $scope.map.center = {
                    lat:  area.lat,
                    lng:  area.lng,
                    zoom: Number(area.zoom) ? Number(area.zoom) : 9,
                };
            }

            $scope.$watch('mapData', function(data) {
                if (data.centerOnMe) {
                    $scope.map.center.autoDiscover = true;
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
