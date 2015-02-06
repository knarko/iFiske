// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ifiske' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ifiske.services' is found in services.js
// 'ifiske.controllers' is found in controllers.js
angular.module('ifiske', ['ionic', 'ifiske.controllers', 'ifiske.services', 'ifiske.api', 'ifiske.db', 'ionic.ion.headerShrink', 'ngCordova', 'inAppBrowser'])

.run(['$ionicPlatform', 'API', 'DB', function($ionicPlatform, API, DB) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.ionic && window.ionic.Keyboard) {
            window.ionic.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        DB.init()
        .then(function() {
            console.log('Initialized DB system');
            DB.populate()
            .then(function(){
                console.log('Populated all the things');
            },
            function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    });
}])


.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router

    // ToDo: Not if logged in
    // Default/fallback url
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
    })

    // Abstract menu state. "Root" state once we're past the login state.
    .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
    })
    .state('menu.home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    })
    .state('menu.info', {
        url: '/info',
        templateUrl: 'templates/info.html'
    })
    .state('menu.contact', {
        url: '/contact',
        templateUrl: 'templates/contact.html',
        controller: 'ContactCtrl'
    })
    .state('menu.legal', {
        url: '/legal',
        templateUrl: 'templates/legal.html',
        controller: 'LegalCtrl'
    })
    .state('menu.userinfo', {
        url: '/userinfo',
        templateUrl: 'templates/userinfo.html',
    })
    .state('menu.counties', {
        url: '/counties',
        templateUrl: 'templates/counties.html',
        controller: 'CountiesCtrl'
    })
    .state('menu.areas', {
	url: '/areas',
	params: {'id': false, 'county': false, 'search': ''},
        templateUrl: 'templates/areas.html',
        controller: 'AreasCtrl'
    })
    .state('menu.areadetail', {
        url: '/area/:id',
        templateUrl: 'templates/area.detail.html',
        controller: 'AreaDetailCtrl'
    })
    .state('menu.areadetailcards', {
        url: '/area/:id/cards',
        templateUrl: 'templates/area.detail.cards.html',
        controller: 'AreaDetailCardCtrl'
    })
    .state('menu.cards', {
        url: '/cards',
        templateUrl: 'templates/cards.html'
    })
    .state('menu.favorites', {
        url: '/favorites',
        templateUrl: 'templates/favorites.html'
    })
    .state('menu.fishes', {
        url: '/fishes',
        templateUrl: 'templates/fishes.html'
    })
    .state('menu.methods', {
        url: '/methods',
        templateUrl: 'templates/methods.html'
    })
    .state('menu.report', {
        url: '/report',
        templateUrl: 'templates/report.html'
    })

}])

