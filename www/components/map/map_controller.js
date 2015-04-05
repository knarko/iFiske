angular.module('ifiske.controllers')
.controller('MapCtrl', [
    '$scope',
    'leafletData',
    'DB',
    function($scope, leafletData, DB) {
        $scope.defaults = {
            tileLayer: 'http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibWFpc3RobyIsImEiOiI3Ums5R0IwIn0.DOhU81clHLEhTj81DIOjdg'
        };
        leafletData.getMap().then(function(map) {
            DB.search('').then(function(data){
                var markers = new L.MarkerClusterGroup();
                for(var i = 0; i < data.length; ++i) {
                    markers.addLayer(new L.Marker([data[i].lat, data[i].lng]).bindPopup(data[i].t));
                }
                map.addLayer(markers);
            });
        });
    }
]);
