
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
.controller('AreasCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('js/get_areas.json')
    .success(function(data) {
        $scope.areas = data.data.response;
    });
    $scope.clearSearch = function() {
        //todo: clear search field
    };

}])

.controller('AreaDetailCtrl', ['$scope', '$http','$stateParams', function($scope, $http, $stateParams) {
    $http.get('js/get_areas.json')
    .success(function(data) {
        $scope.area = data.data.response[$stateParams.id];
        $scope.area.img = 'img/test.jpg';
    });
    katt = $scope;
}])

.controller('AreaDetailCardCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
    $http.get('js/get_products.json')
    .success(function(data) {
        $scope.products = data.data.response;
    });
    katt = $scope;
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

