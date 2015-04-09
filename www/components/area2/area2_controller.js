angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$ionicHistory',
    'localStorage',
    '$rootScope',
    '$ionicViewSwitcher',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    '$ionicModal',
    function($scope, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher, $stateParams, DB, $ionicSlideBoxDelegate, $ionicModal) {

        $scope.map = {};

        $scope.tabsBack = function() {
            // If the current view is at the top of its history stack
            if(!$ionicHistory.viewHistory().currentView.index) {
                /**
                 * Switch to the home history stack
                 * See $ionicHistory source for the even handler used
                 * See home_controller.js for the historyId used
                 */
                $ionicViewSwitcher.nextDirection('back');
                $scope.$emit('$ionicHistory.change', {
                    historyId: localStorage.get('homeHistoryId')
                });
            } else {
                // Default back action
                $rootScope.$ionicGoBack();
            }
        };

        $scope.image_endpoint = 'http://www.ifiske.se';

        var icons = {};
        // Areainfo
        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.images = area.images;

            $ionicSlideBoxDelegate.update();
            $scope.area = area;

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
            DB.getPoiTypes()
            .then(function(poi_types) {
                for(var i = 0; i < poi_types.length; ++i) {
                    var type = poi_types[i];
                    icons[type.ID] = {
                        iconUrl: 'http://www.ifiske.se/'+type.icon
                    };
                }
                DB.getPois(area.orgid)
                .then(function(pois) {
                    console.log(pois);
                    $scope.map.markers = pois.map(function(poi) {
                        return {
                            layer: 'pois',
                            lat: poi.la,
                            lng: poi.lo,
                            icon: icons[poi.type],
                            message: poi.t
                        };
                    });
                }, function(err) {
                    console.log(err);
                });
                DB.getPolygons(area.orgid)
                .then(function(polygons) {
                    console.log(polygons);
                    $scope.map.paths = polygons.map(function(poly) {
                        return {
                            latlngs: JSON.parse('[' + poly.poly + ']'),
                            color: poly.c,
                            weight: 2
                        };
                    });
                }, function(err) {
                     console.log(err);
                });

            });
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
            console.log(fishes);
            $scope.fishes = fishes;
        }, function(err) {
            console.log(err);
        });

        DB.getProductsByArea($stateParams.id)
        .then(function(products) {
            $scope.products = products;
        }, function(err) {
            console.log(err);
        });

        // Area fishes
        $scope.sortorder = '-amount';

        //Area_Cards
        $scope.smsterms = localStorage.get('sms_terms');
        $scope.predicate = "so";


        //SMS-modal
        $ionicModal.fromTemplateUrl('components/area_cards/modal.html', {
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
        $scope.showTerms = function($event) {
            $scope.showingterms = !$scope.showingterms;
        };
        $scope.showingterms = false;

        //Rules modal
        $ionicModal.fromTemplateUrl('components/area_cards/rules_modal.html', {
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

        //Map
        angular.extend($scope.map, {
            center: {
                lat: 62.0,
                lng: 15.0,
                zoom: 5
            },
            layers: {
                baselayers: {
                    mapbox: {
                        name: 'Mapbox',
                        type: 'xyz',
                        url: 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}',
                        layerOptions: {
                            maptype: 'mapbox.outdoors',
                            apikey: 'pk.eyJ1IjoibWFpc3RobyIsImEiOiI3Ums5R0IwIn0.DOhU81clHLEhTj81DIOjdg'
                        }
                    }
                },
                overlays: {
                    pois: {
                        name: 'Fiskeområden',
                        type: 'markercluster',
                        visible: true,
                        layerOptions: {
                            disableClusteringAtZoom: 9,
                            chunkedLoading: true,
                            showCoverageOnHover: false,
                            removeOutsideVisibleBounds: true
                        }
                    }
                }
            }
        });
    }
]);
