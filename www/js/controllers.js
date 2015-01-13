
angular.module('ifiske.controllers', [])
.controller('HomeCtrl', ['$scope', '$state', '$ionicPopover', function($scope, $state, $ionicPopover) {
    var popoverContent = [];
    if (window.localStorage.getItem('session')) {
        popoverContent.push({
            name: 'Min sida',
            route: function() {
                $scope.popover.remove();
                $state.go("main.userinfo");
            }
        });
        popoverContent.push({
            name: 'Logga ut',
            route: function() {
                $scope.popover.remove();
                $state.go("home");
            }
        });

    } else {
        popoverContent.push({
            name: 'Logga in',
            route: function() {
                $scope.popover.remove();
                $state.go("main.login");
            }
        });
        popoverContent.push({
            name: 'Registrera',
            route: function() {
                $scope.popover.remove();
                $state.go("main.register");
            }
        });
    }
    $scope.popoverContent = popoverContent;


    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


}])
.controller('AreasCtrl', ['$scope', '$http', 'API', 'DB', function($scope, $http, API, DB) {
    DB.init()
    .then(function(data) {
        console.log(data);
    }, function(err) {
        console.log(err);
    });

    DB.search('')
    .then(function(data) {
        $scope.areas = data;
        katt = $scope;
    }, function(err) {
         console.log(err);
    });
    $scope.clearSearch = function() {
        //todo: clear search field
    };

}])

.controller('AreaDetailCtrl', ['$scope', 'API','$stateParams', 'DB', function($scope, API, $stateParams, DB) {
    DB.getArea($stateParams.id)
    .then(function(data) {
        $scope.area = data;
        //$scope.area.img = 'img/test.jpg';
    }, function(err) {
        console.log(err);
    });
}])

.controller('AreaDetailCardCtrl', ['$scope', 'API', '$stateParams', function($scope, API, $stateParams) {
    API.get_products($stateParams.id)
    .success(function(data) {
        $scope.products = data.data.response;
    });
}])

.controller('LoginCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    $scope.user = {};
    $scope.signIn = function(user) {
        API.user_login(user.username, user.password)
        .success(function(data) {
            console.log(data.status);
            data.status === "success" && $state.go('home');
        })
    }
}])

