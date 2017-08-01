angular.module('ifiske.controllers')
  .controller('HomeCtrl', function(
    $scope,
    $state,
    $ionicHistory,
    localStorage,
    sessionData,
    Update,
    analytics,
    Admin,
  ) {
    $scope.$on('$ionicView.load', function() {
      if (sessionData.token) {
        analytics.trackMetric('Logged in', 1);
      } else {
        analytics.trackMetric('Logged in', 0);
      }
    });

    $scope.openAdmin = function() {
      Admin.getOrganizations().then(function(organizations) {
        var orgIds = Object.keys(organizations);
        if (orgIds.length === 1) {
          $state.go('app.admin.org', {id: orgIds[0]});
        } else {
          $state.go('app.admin.main');
        }
      }, function(err) {
        console.warn(err);
        $scope.$emit('$ionicView.enter');
      });
    };

    $scope.$on('$ionicView.enter', function() {
      Admin.isAdmin().then(function(isAdmin) {
        $scope.admin = isAdmin;
      }, function(err) {
        console.warn(err);
        $scope.admin = false;
      });
    });
    $scope.loggedIn = sessionData;

    $scope.update = Update;

    // Current history stack Id. See area_controller for usage.
    localStorage.set('homeHistoryId', $ionicHistory.currentHistoryId());

    $scope.news = function() {
      return localStorage.get('NEWS');
    };

    $scope.search = function($event) {
      if ($event.keyCode === 13) { // if enter-key
        $event.preventDefault();
        var searchTerm = $event.srcElement.value;
        analytics.trackEvent('Search', searchTerm);
        $state.go('app.areas', {search: searchTerm});
      }
    };
  });
