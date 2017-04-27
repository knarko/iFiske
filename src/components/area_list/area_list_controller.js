angular.module('ifiske.controllers')
    .controller('AreasCtrl', function(
        $scope,
        $stateParams,
        $ionicScrollDelegate,
        Area,
        debounce
    ) {
        var copy = $stateParams.search;
        $scope.searchTerm = copy;
        $scope.county = $stateParams.county || 'Search results';
        function searchImmediate(searchTerm) {
            return Area.search(searchTerm, $stateParams.id)
                .then(function(data) {
                    console.log(data);
                    $scope.areas = data;
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
            }
        };

        $scope.clearSearch = function() {
            $scope.searchTerm = '';
        };

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };
    });
