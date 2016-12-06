angular.module('ifiske.controllers')
.controller('UserCtrl', function($scope, User, Admin) {
    var levelnames = [
        'USER_LEVEL_0',
        'USER_LEVEL_1',
        'USER_LEVEL_2',
    ];
    $scope.$on('$ionicView.beforeEnter', function() {
        Admin.getOrganizations().then(function(res) {
            for (var e in res) {
                $scope.isAdmin = true;
                res[e].levelname = levelnames[res[e].level];
            }
            $scope.organizations = res;
        }, function(res) {
            console.error(res);
        });
        User.getInfo()
        .then(function(user) {
            $scope.user = user;
        });
        User.getNumbers()
        .then(function(numbers) {
            $scope.numbers = numbers;
        });
    });
});
