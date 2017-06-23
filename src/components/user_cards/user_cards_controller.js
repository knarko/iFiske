angular.module('ifiske.controllers')
  .controller('UserCardsCtrl', function(
    $scope,
    User,
    PullToRefresh,
  ) {
    $scope.pred = '-to';
    $scope.$on('$ionicView.beforeEnter', function() {
      PullToRefresh.trigger('licenses-content');
    });

    function setValid(data) {
      $scope.revoked = [];
      $scope.active = [];
      $scope.expired = [];
      $scope.inactive = [];
      for (var i = 0; i < data.length; ++i) {
        $scope[data[i].validity].push(data[i]);
      }
      $scope.products = data;
    }
    function initilize() {
      $scope.now = Date.now();
      User.getProducts().then(setValid);
      return User.update()
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
