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

        function updateMypos(obj) {
            //rotate iconAngle 45 deg since the icon is tilted by default
            obj.iconAngle = (obj.iconAngle | 0) - 45;
            /* Hackfix to make it update =( */
            if($scope.markers.mypos2) {
                angular.extend($scope.markers.mypos2, obj);
                $scope.markers.mypos = $scope.markers.mypos2;
                delete $scope.markers.mypos2;
            } else {
                angular.extend($scope.markers.mypos, obj);
                $scope.markers.mypos2 = $scope.markers.mypos;
                delete $scope.markers.mypos;
            }
        }

        var mapboxUrl = 'http://api.tiles.mapbox.com/v4/{maptype}/{z}/{x}/{y}@2x.png?access_token={apikey}';
        var apikey = localStorage.get('mapbox_api');

        angular.extend($scope, {
            center: {
                lat: 62.0,
                lng: 15.0,
                zoom: 5
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
                        layerOptions: {
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
                mypos: {
                    lat: 0,
                    lng: 0,
                    iconAngle: -45,
                    message: 'hi!',
                    icon: {
                        type: 'div',
                        iconSize: [40,40],
                        iconAnchor: [20,20],
                        className: 'icon ion-navigate myposition'
                    }
                }
            }
        });

        $ionicPlatform.ready(function() {
            $cordovaGeolocation.watchPosition({
                frequency: 3000
            }).then(null, function(error) {
                console.error(error);
            }, function(pos) {
                $timeout(function(){
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

        $scope.$on('$ionicView.beforeEnter', function() {
            console.log('hi!');
            DB.search('').then(function(areas) {
                for(var i = 0; i < areas.length; ++i) {
                    var a = areas[i];
                    $scope.markers['area' + i] = {
                        layer: 'fishareas',
                        lat: a.lat,
                        lng: a.lng,
                        getMessageScope: function() {
                            var new_scope = $scope.$new();
                            new_scope.area = a;
                            return new_scope;
                        },
                        message: '<a ui-sref="app.area({id: area.ID })">{{area.t}}</a>'
                    };
                }
            });
        });
    }
]);
