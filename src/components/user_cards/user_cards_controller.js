angular.module('ifiske.controllers')
.controller('UserCardsCtrl', function(
    $scope,
    User,
    Product,
    Update,
    PullToRefresh
) {
    $scope.pred = '-to';
    $scope.$on('$ionicView.beforeEnter', function() {
        PullToRefresh.trigger('licenses-content');
    });

    function initilize() {
        Update.update(true)
        .then(function() {
            $scope.now = Date.now();
            return User.getProducts();
        })
        .then(function(data) {
            $scope.valid = [];
            $scope.expired = [];
            $scope.inactive = [];
            for (var i = 0; i < data.length; ++i) {
                data[i].validity = Product.getValidity(data[i]);
                $scope[data[i].validity].push(data[i]);
            }
            $scope.products = data;
            console.log($scope);
        }, function(err) {
            console.log(err);
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    // $scope.$on('$ionicView.loaded', initilize);
    $scope.update = function() {
        initilize();
    };
});
