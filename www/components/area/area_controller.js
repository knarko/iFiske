angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$ionicHistory',
    'localStorage',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    '$ionicModal',
    'leafletEvents',
    '$ionicPlatform',
    '$cordovaGeolocation',
    '$cordovaDeviceOrientation',
    '$timeout',
    function($scope, $ionicHistory, localStorage,  $stateParams, DB, $ionicSlideBoxDelegate, $ionicModal, leafletEvents, $ionicPlatform, $cordovaGeolocation, $cordovaDeviceOrientation, $timeout) {
        function updateMypos(obj) {
            /* Hackfix to make it update =( */
            if($scope.map.markers.mypos2) {
                angular.extend($scope.map.markers.mypos2, obj);
                $scope.map.markers.mypos = $scope.map.markers.mypos2;
                delete $scope.map.markers.mypos2;
            } else {
                angular.extend($scope.map.markers.mypos, obj);
                $scope.map.markers.mypos2 = $scope.map.markers.mypos;
                delete $scope.map.markers.mypos;
            }
        }
        function getMypos() {
            console.log($scope);
            return $scope.map.markers.mypos || $scope.map.markers.mypos2;
        }

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
                $timeout(function(){
                    updateMypos({
                        iconAngle: heading.trueHeading
                    });
                });
            });
        });

        $scope.map = {
            center: {},
            markers: {
                mypos: {
                    lat: 0,
                    lng: 0,
                    iconAngle: 0,
                    message: 'This is you!',
                }
            }
        };
        $scope.image_endpoint = 'http://www.ifiske.se';

        var icons = {};
        $scope.navigate = function(poi) {
            console.log($scope);
            var pos = getMypos();
            launchnavigator.navigate(
                [$scope.navto.lat, $scope.navto.lng],
                null,
                function(){
                    console.log('Opening navigator');
                },
                function(error){
                    alert('Navigation failed!');
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

        $scope.$on('leafletDirectiveMarker.popupclose', function(event, args) {
            //hide navtobutton
            $scope.navto = null;
        });


        // Areainfo
        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.map.center = {
                lat: area.lat,
                lng: area.lng,
                zoom: Number(area.zoom) ? Number(area.zoom) : 9
            };
            $scope.images = area.images;

            $scope.area = area;
            $ionicSlideBoxDelegate.$getByHandle('tabs').update();

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
            DB.getPoiTypes()
            .then(function(poi_types) {
                for (var i = 0; i < poi_types.length; ++i) {
                    var type = poi_types[i];
                    icons[type.ID] = {
                        iconUrl: 'http://www.ifiske.se/' + type.icon,
                        iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -35],
                    };
                }
                DB.getPois(area.orgid)
                .then(function(pois) {
                    for(var i = 0; i < pois.length; ++i) {
                        var poi = pois[i];

                        $scope.map.markers['poi' + i] = {
                            layer: 'pois',
                            lat: poi.la,
                            lng: poi.lo,
                            icon: icons[poi.type],
                            message: poi.t
                        };
                    }
                    $scope.map.markers['area'] = {
                        layer: 'pois',
                        lat: area.lat,
                        lng: area.lng,
                        message: area.t
                    };
                }, function(err) {
                    console.error(err);
                });
                DB.getPolygons(area.orgid)
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
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
            $scope.fishes = fishes;
            $ionicSlideBoxDelegate.$getByHandle('tabs').update();
        }, function(err) {
            console.log(err);
        });

        DB.getProductsByArea($stateParams.id)
        .then(function(products) {
            $scope.products = products;
            $ionicSlideBoxDelegate.$getByHandle('tabs').update();
        }, function(err) {
            console.log(err);
        });

        // Area fishes
        $scope.sortorder = '-amount';

        //Area_Cards
        $scope.smsterms = localStorage.get('sms_terms');
        $scope.predicate = 'so';

        //SMS-modal
        $ionicModal.fromTemplateUrl('components/area/sms_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.sms_modal = modal;
        });
        $scope.openModal = function(product) {
            $scope.sms_modal.show();
            $scope.product = product;
        };
        $scope.closeModal = function() {
            $scope.sms_modal.hide();
        };
        $scope.showTerms = function() {
            $scope.showingterms = !$scope.showingterms;
        };
        $scope.showingterms = false;

        //Rules modal
        $ionicModal.fromTemplateUrl('components/area/rules_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.rules_modal = modal;
        });
        $scope.openRulesModal = function(product) {
            $scope.rules_modal.show();
            $scope.product = product;
        };
        $scope.closeRulesModal = function() {
            $scope.rules_modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.sms_modal.remove();
            $scope.rules_modal.remove();
        });


        $scope.gotoProducts = function() {
            $ionicSlideBoxDelegate.$getByHandle('tabs').slide(1);
        };

        //Map
        angular.extend($scope.map, {
            layers: {
                baselayers: {
                    outdoors: {
                        name: 'Utomhuskarta',
                        type: 'xyz',
                        url: 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}',
                        layerOptions: {
                            maptype: 'mapbox.outdoors',
                            apikey: 'pk.eyJ1IjoibWFpc3RobyIsImEiOiI3Ums5R0IwIn0.DOhU81clHLEhTj81DIOjdg'
                        }
                    },
                    satellite: {
                        name: 'Satellit',
                        type: 'xyz',
                        url: 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}',
                        layerOptions: {
                            maptype: 'mapbox.satellite',
                            apikey: 'pk.eyJ1IjoibWFpc3RobyIsImEiOiI3Ums5R0IwIn0.DOhU81clHLEhTj81DIOjdg'
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
            },
            paths: {}
        });
    }
]);
