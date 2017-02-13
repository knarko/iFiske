angular.module('ifiske.controllers')
.controller('AreaMapCtrl',
function(
    $scope,
    MapData,
    $ionicPlatform,
    $ionicPopup,
    $translate
) {
    $scope.map = {};
    function updateMap() {
        $scope.map.area = $scope.area;
        MapData.getPois($scope.area.orgid)
        .then(function(pois) {
            $scope.map.pois = pois;
        }, function(err) {
            console.error(err);
        });
        MapData.getPolygons($scope.area.orgid)
        .then(function(polygons) {
            $scope.map.polygons = polygons;
        }, function(err) {
            console.error(err);
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($scope.area) {
            updateMap();
        }
        $scope.$on('ifiske-area', updateMap);

        $scope.navigate = function() {
            $ionicPlatform.ready(function() {
                window.launchnavigator.navigate(
                    [$scope.navto.lat, $scope.navto.lng],
                    null,
                    function() {
                        console.log('Opening navigator');
                    },
                    function(error) {
                        $ionicPopup.alert({
                            title:    $translate.instant('Error'),
                            template: $translate.instant('Unknown error', {error: error}),
                        });
                    });
            });
        };

        var enabledEvents = ['popupopen', 'popupclose'];
        $scope.events = {
            enabled: enabledEvents,
        };

        $scope.$on('leaflet.popupopen', function(_event, args) {
                // show navtobutton
            console.log('beeop', args.popup.getLatLng());

            $scope.navto = args.popup.getLatLng();
            $scope.$digest();
        });

        $scope.$on('leaflet.popupclose', function() {
                // hide navtobutton
            $scope.navto = null;
            $scope.$digest();
        });
    });
});
