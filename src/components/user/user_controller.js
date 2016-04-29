angular.module('ifiske.controllers')
.controller('UserCtrl', function($scope, User, API) {
    var levelnames = [
        'Tillsyningsman',
        'Kassör',
        'Admin',
    ];
    API.user_organizations().then(function(res) {
        for (var e in res) {
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
