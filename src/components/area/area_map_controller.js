angular.module('ifiske.controllers')
.controller('AreaMapCtrl', [
    '$scope',
    'DB',
    '$ionicPlatform',
    function($scope, DB, $ionicPlatform) {
        $scope.map = {};
        var updateMap = function() {
            $scope.map.area = $scope.area;
            DB.getPois($scope.area.orgid)
            .then(function(pois) {
                $scope.map.pois = pois;
            }, function(err) {
                console.error(err);
            });
            DB.getPolygons($scope.area.orgid)
            .then(function(polygons) {
                $scope.map.polygons = polygons;
            }, function(err) {
                console.error(err);
            });
        };

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
                            // TODO: don't alert
                            alert('Navigation failed!', error);
                        });
                });
            };

            var enabledEvents = ['popupopen', 'popupclose'];
            $scope.events = {
                enabled: enabledEvents,
            };

            $scope.$on('leafletDirectiveMarker.popupopen', function(event, args) {
                // show navtobutton
                $scope.navto = args.model;
            });

            $scope.$on('leafletDirectiveMarker.popupclose', function() {
                // hide navtobutton
                $scope.navto = null;
            });
        });
    },
]);
