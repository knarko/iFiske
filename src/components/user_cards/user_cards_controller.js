angular.module('ifiske.controllers')
.controller('UserCardsCtrl', function(
    $scope,
    $stateParams,
    DB,
    Update,
    PullToRefresh
) {
    // TODO: put in Product-model
    function getProductValidity(product) {
        var now = parseInt(Date.now() / 1000);
        if (product.fr < now) {
            return now < product.to ? 'valid' : 'expired';
        }
        return 'inactive';
    }
    $scope.pred = '-to';
    $scope.$on('$ionicView.beforeEnter', function() {
        PullToRefresh.trigger('licenses-content');
    });

    var initilize = function() {
        Update.update(true)
        .then(function() {
            $scope.now = Date.now();
            return DB.getUserProducts();
        })
        .then(function(data) {
            $scope.valid = [];
            $scope.expired = [];
            $scope.inactive = [];
            for (var i = 0; i < data.length; ++i) {
                data[i].validity = getProductValidity(data[i]);
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
    };

    // $scope.$on('$ionicView.loaded', initilize);
    $scope.update = function() {
        initilize();
    };
});
