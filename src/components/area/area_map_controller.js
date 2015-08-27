angular.module('ifiske.controllers')
.controller('AreaMapCtrl', [
    '$scope',
    'DB',
    'leafletEvents',
    '$ionicPlatform',
    '$cordovaGeolocation',
    '$cordovaDeviceOrientation',
    '$timeout',
    'localStorage',
    function($scope, DB, leafletEvents, $ionicPlatform, $cordovaGeolocation, $cordovaDeviceOrientation, $timeout, localStorage) {

        var icons = {};
        var mapboxUrl = 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
        var apikey = localStorage.get('mapbox_api');

        var updateMap = function() {
            $scope.map.center = {
                lat: $scope.area.lat,
                lng: $scope.area.lng,
                zoom: Number($scope.area.zoom) ? Number($scope.area.zoom) : 9
            };

            DB.getPoiTypes()
            .then(function(poi_types) {
                for (var i = 0; i < poi_types.length; ++i) {
                    var type = poi_types[i];
                    icons[type.ID] = {
                        iconUrl: $scope.image_endpoint + type.icon,
                        iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -35],
                    };
                }
                DB.getPois($scope.area.orgid)
                .then(function(pois) {
                    for (var i = 0; i < pois.length; ++i) {
                        var poi = pois[i];

                        $scope.map.markers['poi' + i] = {
                            layer: 'pois',
                            lat: poi.la,
                            lng: poi.lo,
                            icon: icons[poi.type],
                            message: '<h4>' + poi.t + '</h4><p>' + poi.d + '</p>',
                            popupOptions: {
                                maxWidth: window.innerWidth - 50
                            }
                        };
                    }
                    $scope.map.markers.area = {
                        layer: 'pois',
                        lat: $scope.area.lat,
                        lng: $scope.area.lng,
                        message: $scope.area.t
                    };
                }, function(err) {
                    console.error(err);
                });
                DB.getPolygons($scope.area.orgid)
                .then(function(polygons) {
                    $scope.map.paths = polygons.map(function(poly) {
                        return {
                            latlngs: JSON.parse('[' + poly.poly + ']'),
                            color: poly.c,
                            weight: 2,
                            opacity: 0.5,
                            fillColor: poly.c,
                            type: 'polygon'
                        };
                    });
                }, function(err) {
                    console.error(err);
                });

            });
        };
        angular.extend($scope, {
            map: {
                center: {},
                paths: {},

                markers: {
                },

                layers: {
                    baselayers: {
                        outdoors: {
                            name: 'Utomhus',
                            type: 'xyz',
                            url: mapboxUrl,
                            layerOptions: {
                                maptype: 'mapbox.outdoors',
                                apikey: apikey
                            }
                        },
                        satellite: {
                            name: 'Satellit',
                            type: 'xyz',
                            url: mapboxUrl,
                            layerOptions: {
                                maptype: 'mapbox.satellite',
                                apikey: apikey
                            }
                        }
                    },
                    overlays: {
                        pois: {
                            name: 'Ställen',
                            type: 'markercluster',
                            visible: true,
                            layerParams: {
                                showOnSelector: false,
                                disableClusteringAtZoom: 9,
                                chunkedLoading: true,
                                showCoverageOnHover: false,
                                removeOutsideVisibleBounds: true
                            }
                        }
                    }
                }
            }
        });

        $scope.$on('$ionicView.beforeEnter', function() {
            if ($scope.area) {
                updateMap();
            }
            $scope.$on('ifiske-area', updateMap);


            $scope.navigate = function() {
                //var pos = getMypos(); //might need for ios
                $ionicPlatform.ready(function() {
                    launchnavigator.navigate(
                        [$scope.navto.lat, $scope.navto.lng],
                        null,
                        function() {
                            console.log('Opening navigator');
                        },
                        function(error) {
                            alert('Navigation failed!', error);
                        });
                });
            };

            var enabledEvents = ['popupopen', 'popupclose'];
            $scope.events = {
                enabled: enabledEvents
            };

            $scope.$on('leafletDirectiveMarker.popupopen', function(event, args) {
                //show navtobutton
                $scope.navto = args.model;
            });

            $scope.$on('leafletDirectiveMarker.popupclose', function() {
                //hide navtobutton
                $scope.navto = null;
            });
        });
    }
]);
