angular.module('ifiske.controllers')
.controller('MapCtrl', [
    '$scope',
    'leafletData',
    'DB',
    function($scope, leafletData, DB) {
        leafletData.getMap().then(function(map) {
            DB.search('').then(function(data){
                var markers = new L.MarkerClusterGroup();
                for(var i = 0; i < data.length; ++i) {
                    markers.addLayer(new L.Marker([data[i].lat, data[i].lng]));
                }
                map.addLayer(markers);
            });
        });
    }
]);
