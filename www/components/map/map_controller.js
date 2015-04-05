angular.module('ifiske.controllers')
.controller('MapCtrl', [
    '$scope',
    'leafletData',
    'DB',
    function($scope, leafletData, DB) {
        DB.search('').then(function(data){

            var markers = [];
            for(var i = 0; i < data.length; ++i) {
                markers[i] = {
                    message: data[i].t,
                    focus: true,
                    lat: data[i].lat,
                    lng: data[i].lng
                };
            }
            $scope.markers = markers;
        });

        leafletData.getMap().then(function(map) {
            console.log(L);
        });
    }
]);
