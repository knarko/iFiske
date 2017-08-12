angular.module('ifiske.controllers')
  .controller('AreaMapCtrl',
    function(
      $scope,
      MapData,
      $ionicPlatform,
      $ionicPopup,
      $translate,
    ) {
      $scope.map = {};
      function updateMap() {
        $scope.map.area = $scope.area;
        MapData.getPois($scope.area.orgid)
          .then(function(pois) {
            $scope.map.pois = pois;
          });
        MapData.getPolygons($scope.area.orgid)
          .then(function(polygons) {
            $scope.map.polygons = polygons;
          }, function(err) {
            $scope.map.polygons = [];
            console.warn(err);
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
              {
                successCallback: () => {
                  console.log('Opening navigator');
                },
                errorCallback: error => {
                  Raven.captureException(error);
                  if (error === 'cancelled') {
                    return;
                  }
                  $ionicPopup.alert({
                    title:    $translate.instant('Error'),
                    template: $translate.instant('Unknown error', {error}),
                  });
                },
                destinationName: $scope.navto.title,
              });
          });
        };

        $scope.$on('leaflet.popupopen', function(_event, args) {
          // show navtobutton
          $scope.navto = args.popup.getLatLng();
          $scope.navto.title = args.popup.options.title;
          $scope.$digest();
        });

        $scope.$on('leaflet.popupclose', function() {
          // hide navtobutton
          $scope.navto = null;
          $scope.$digest();
        });
      });
    });
