angular.module('ifiske.controllers')
.controller('MapCtrl', [
    '$scope',
    'leafletData',
    '$ionicPlatform',
    'DB',
    '$cordovaGeolocation',
    '$cordovaDeviceOrientation',
    '$timeout',
    'localStorage',
    function($scope, leafletData, $ionicPlatform, DB, $cordovaGeolocation, $cordovaDeviceOrientation, $timeout, localStorage) {

        var mapboxUrl = 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
        var apikey = localStorage.get('mapbox_api');

        var lc = new L.control.locate({
            follow: false,
            position: 'bottomright',
            keepCurrentZoomLevel: false,
            stopFollowingOnDrag: true,
            remainActive: true,
            onLocationError: function(err) {
                console.error(err);
                $timeout(function() {
                    lc.start(); //try again
                });
            },
            onLocationOutsideMapBounds: function(context) {
                console.log(context);
            },
            locateOptions: {
                maxZoom: 14
            },
            icon: 'icon ion-android-locate'

        });
        angular.extend($scope, {
            center: {
                lat: 62.0,
                lng: 15.0,
                zoom: 9,
                autoDiscover: true
            },
            controls: {
                custom: [
                    lc
                ]
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
                    fishareas: {
                        name: 'Fiskeområden',
                        type: 'markercluster',
                        visible: true,
                        layerParams: {
                            showOnSelector: false,
                            disableClusteringAtZoom: 9,
                            chunkedLoading: true,
                            showCoverageOnHover: false,
                            removeOutsideVisibleBounds: true
                        }
                    },
                }
            },
            markers: {
            }
        });

        var createscope = function(a) {
            return function() {
                var new_scope = $scope.$new();
                new_scope.area = a;
                console.log(a);
                return new_scope;
            };
        };

        $scope.$on('$ionicView.beforeEnter', function() {
            DB.search('').then(function(areas) {
                for(var i = 0; i < areas.length; ++i) {
                    var a = areas[i];
                    $scope.markers['area' + i] = {
                        layer: 'fishareas',
                        lat: a.lat,
                        lng: a.lng,
                        getMessageScope: createscope(a),
                        message: '<a ui-sref="app.area({id: area.ID })" ng-bind="area.t"></a>'
                    };
                }
            });
        });
    }
]);
