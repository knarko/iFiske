angular.module('ifiske.controllers')
  .controller('MenuCtrl', function(
    $scope,
    $state,
    $ionicPopover,
    sessionData,
    Update,
    User,
  ) {
    $scope.sessionData = sessionData;

    $ionicPopover.fromTemplateUrl('components/menu/popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.userinfo = function() {
      $scope.popover.hide();
      $state.go('app.userinfo');
    };

    $scope.login = function() {
      $scope.popover.hide();
      $state.go('app.login');
    };
    $scope.register = function() {
      $scope.popover.hide();
      $state.go('app.register.fork');
    };
    $scope.logout = function() {
      $scope.popover.hide();
      User.logout();
    };

    $scope.settings = function() {
      $scope.popover.hide();
      $state.go('app.settings.main');
    };

    $scope.forcedUpdate = function() {
      Update.forcedUpdate();
    };
  });
