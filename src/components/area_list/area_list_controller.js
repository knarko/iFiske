angular.module('ifiske.controllers')
  .controller('AreasCtrl', function(
    $scope,
    $stateParams,
    $ionicScrollDelegate,
    Area,
    Fish,
    debounce,
    $cordovaKeyboard,
  ) {
    var copy = $stateParams.search;
    $scope.searchTerm = copy;
    $scope.county = $stateParams.county || 'Search results';
    function searchImmediate(searchTerm) {
      if (searchTerm) {
        Fish.search(searchTerm).then(fishes => {
          if (fishes.length) {
            $scope.foundFish = fishes[0].item;
          } else {
            $scope.foundFish = undefined;
          }
        });
      } else {
        $scope.foundFish = undefined;
      }
      return Area.search(searchTerm, $stateParams.id)
        .then(function(data) {
          $scope.areas = data;
          if ($scope.foundFish) {
            $scope.areas.forEach(area => {
              for (let i = 5; i >= 0; --i) {
                let fishes = area['fish_' + i];
                if (fishes && fishes.search($scope.foundFish.t) !== -1) {
                  area.level = i;
                  break;
                }
              }
            });
          }
          $scope.scrollTop();
        }, function(err) {
          console.log(err);
        });
    }
    $scope.search = debounce(searchImmediate, 500);

    $scope.$on('$ionicView.beforeEnter', () => {
      searchImmediate($scope.searchTerm);
    });

    $scope.onChange = function($event) {
      console.log($event);
    };

    $scope.keyPress = function($event) {
      if ($event.keyCode === 13) { // if enter-key
        $event.preventDefault();
        var searchTerm = $event.srcElement.value;
        searchImmediate(searchTerm);
        if (window.cordova) {
          $cordovaKeyboard.close();
        }
      }
    };

    $scope.clearSearch = function() {
      $scope.searchTerm = '';
      searchImmediate($scope.searchTerm);
    };

    $scope.scrollTop = function() {
      $ionicScrollDelegate.scrollTop();
    };
  });
