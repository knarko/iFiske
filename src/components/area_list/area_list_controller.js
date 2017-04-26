angular.module('ifiske.controllers')
    .controller('AreasCtrl', function(
        $scope,
        $stateParams,
        $ionicScrollDelegate,
        Area,
        debounce
    ) {
        var copy = $stateParams.search;
        $scope.search = copy;
        $scope.county = $stateParams.county || 'Search results';
        $scope.search = debounce(function(searchTerm) {
            Area.search(searchTerm, $stateParams.id)
                .then(function(data) {
                    console.log(data);
                    $scope.areas = data;
                    $scope.scrollTop();
                }, function(err) {
                    console.log(err);
                });
        }, 200);

        $scope.search('');

        $scope.onChange = function($event) {
            console.log($event);
        };

        $scope.keyPress = function($event) {
            if ($event.keyCode === 13) { // if enter-key
                $event.preventDefault();
                var searchTerm = $event.srcElement.value;
                $scope.search(searchTerm);
            }
        };

        $scope.clearSearch = function() {
            $scope.searchTerm = '';
        };

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };
    });
