angular.module('ifiske.controllers')
.controller('AreaMapCtrl', [
    '$scope',
    'DB',
    'leafletEvents',
    '$ionicPlatform',
    '$cordovaGeolocation',
    '$cordovaDeviceOrientation',
    '$timeout',
    function($scope, DB, leafletEvents, $ionicPlatform, $cordovaGeolocation, $cordovaDeviceOrientation, $timeout) {
        function updateMypos(obj) {
            // We need to create a new named element in order for the update to register
            if ($scope.map.markers.mypos2) {
                angular.extend($scope.map.markers.mypos2, obj);
                $scope.map.markers.mypos = $scope.map.markers.mypos2;
                delete $scope.map.markers.mypos2;
            } else {
                angular.extend($scope.map.markers.mypos, obj);
                $scope.map.markers.mypos2 = $scope.map.markers.mypos;
                delete $scope.map.markers.mypos;
            }
        }
        /* might need for ios
           function getMypos() {
           return $scope.map.markers.mypos || $scope.map.markers.mypos2;
           }
           */

        var icons = {};
        var mapboxUrl = 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
        //TODO: Get apikey from ifiske-api
        var apikey = 'pk.eyJ1IjoibWFpc3RobyIsImEiOiI3Ums5R0IwIn0.DOhU81clHLEhTj81DIOjdg';

        angular.extend($scope, {
            map: {
                center: {},
                paths: {},

                markers: {
                    mypos: {
                        lat: 0,
                        lng: 0,
                        iconAngle: 0,
                        message: 'This is you!',
                    }
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
                            layerOptions: {
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
            $scope.$on('ifiske-area', function() {
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
                                message: poi.t
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
            });

            $ionicPlatform.ready(function() {
                $cordovaGeolocation.watchPosition({
                    frequency: 3000
                }).then(null, function(error) {
                    console.error(error);
                }, function(pos) {
                    $timeout(function() {
                        updateMypos({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        });
                    });
                });

                $cordovaDeviceOrientation.watchHeading({
                    frequency: 3000
                }).then(null, function(error) {
                    console.error(error);
                }, function(heading) {
                    $timeout(function() {
                        updateMypos({
                            iconAngle: heading.trueHeading
                        });
                    });
                });
            });

            $scope.navigate = function() {
                console.log($scope);
                //var pos = getMypos(); //might need for ios
                window.launchnavigator.navigate(
                    [$scope.navto.lat, $scope.navto.lng],
                    null,
                    function() {
                        console.log('Opening navigator');
                    },
                    function(error) {
                        alert('Navigation failed!', error);
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
