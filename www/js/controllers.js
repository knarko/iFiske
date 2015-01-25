
angular.module('ifiske.controllers', [])
.controller('MenuCtrl', ['$scope', '$state', '$ionicPopover', function($scope, $state, $ionicPopover) {
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
                $state.go('menu.home');
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
    var areaData = [];
    $scope.areas = [];
    DB.search('')
    .then(function(data) {
        areaData = data;
        console.log(areaData);
        for(var i = length; i < 20; ++i) {
            $scope.areas.push(areaData[i]);
        }
    }, function(err) {
        console.log(err);
    });
    $scope.clearSearch = function() {
        //todo: clear search field
    };
    $scope.moreData = true;

    $scope.moreAreas = function() {
        var length = $scope.areas.length;
        for(var i = length; i < length+20 && i < areaData.length; ++i) {
            console.log(i);
            $scope.areas.push(areaData[i]);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

}])

.controller('AreaDetailCtrl', ['$scope', 'API','$stateParams', 'DB', function($scope, API, $stateParams, DB) {
    DB.getArea($stateParams.id)
    .then(function(data) {
        $scope.area = data;
        $scope.area.img = 'img/test.jpg';
    }, function(err) {
        console.log(err);
    });
}])

.controller('AreaDetailCardCtrl', ['$scope', 'DB', '$stateParams', function($scope, DB, $stateParams) {
    DB.getProductsByArea($stateParams.id)
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
         console.log(err);
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

.controller('LegalCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    API.get_terms_of_service()
    .success(function(data) {
        $scope.tos = data.data.response;
    });
}])

.controller('ContactCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    API.get_contact_info()
    .success(function(data) {
        $scope.contactInfo = data.data.response;
    });
}])
