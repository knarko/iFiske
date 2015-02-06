
angular.module('ifiske.controllers', [])
.controller('MenuCtrl', ['$scope', '$state', '$ionicPopover', function($scope, $state, $ionicPopover) {
    var popoverContent = [];

    // If logged in
    if (window.localStorage.getItem('session')) {
	// User info
        popoverContent.push({
            name: 'Min sida',
            route: function() {
                $scope.popover.remove();
                $state.go("menu.userinfo");
            }
        });

	// ToDo: Actual logout
        popoverContent.push({
            name: 'Logga ut',
            route: function() {
                $scope.popover.remove();
                $state.go('menu.home');
            }
        });

	// Not logged in
    } else {
	// Login
        popoverContent.push({
            name: 'Logga in',
            route: function() {
                $scope.popover.remove();
                $state.go("login");
            }
        });
	// ToDo: Remove and route through login screen?
	// Register
        popoverContent.push({
            name: 'Registrera',
            route: function() {
                $scope.popover.remove();
                $state.go("register");
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

.controller('CountiesCtrl', ['$scope', 'DB', function($scope, DB) {
    DB.getCounties()
    .then(function(data) {
        $scope.counties = data;
    }, function(err) {
        console.log(err);
    });
}])

.controller('AreasCtrl', ['$scope', '$stateParams', '$ionicScrollDelegate' ,'DB', function($scope, $stateParams, $ionicScrollDelegate ,DB) {
    $scope.search = {};
    $scope.queryBy = '$';
    $scope.county = $stateParams.county;
    DB.search('', $stateParams.id)
    .then(function(data) {
            $scope.areas = data;
    }, function(err) {
        console.log(err);
    });
    $scope.clearSearch = function() {
        //todo: clear search field
    };
    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
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
    $scope.predicate = "so"
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
	// ToDo: Handle failed login
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
