angular.module('ifiske.controllers')
.controller('MapCtrl', [
    '$scope',
    'leafletData',
    'DB',
    function($scope, leafletData, DB) {
        DB.search('').then(function(areas) {
            $scope.markers = areas.map(function(a) {
                return {
                    layer: 'fishareas',
                    lat: a.lat,
                    lng: a.lng,
                    getMessageScope: function() {
                        var new_scope = $scope.$new();
                        new_scope.area = a;
                        return new_scope;
                    },
                    message: '<a ui-sref="menu.area({id: area.ID })">{{area.t}}</a>'
                };
            });
        });
        angular.extend($scope, {
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
                    fishareas: {
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
