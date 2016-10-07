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

    function setValid(data) {
        $scope.valid = [];
        $scope.expired = [];
        $scope.inactive = [];
        for (var i = 0; i < data.length; ++i) {
            data[i].validity = Product.getValidity(data[i]);
            $scope[data[i].validity].push(data[i]);
        }
        $scope.products = data;
    }
    function initilize() {
        $scope.now = Date.now();
        User.getProducts().then(setValid);
        return Update.update(true)
        .then(User.getProducts)
        .then(setValid, function(err) {
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
