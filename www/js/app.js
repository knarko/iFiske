// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ifiske' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ifiske.services' is found in services.js
// 'ifiske.controllers' is found in controllers.js
angular.module('ifiske', ['ionic', 'ifiske.controllers', 'ifiske.services', 'ifiske.api', 'ifiske.db', 'ionic.ion.headerShrink', 'ngCordova', 'infinite-scroll'])

.run(function($ionicPlatform, API, DB) {
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
        .then(function(data) {
            console.log('Initialized DB');
        }, function(err) {
            console.log(err);
        });

        API.get_areas()
        .success(function(data) {
            DB.insertArea(data.data.response)
            .then(function() {
                console.log('inserted data');
            }, function(err) {
                console.log(err)
            });
        });
    });
})


.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main/login');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.

    $stateProvider
    .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
    })
    .state('menu.home', {
        url: '/home',
        templateUrl: 'templates/home.html'
    })
    .state('menu.info', {
        url: '/info',
        templateUrl: 'templates/info.html'
    })
    .state('menu.contact', {
        url: '/contact',
        templateUrl: 'templates/contact.html'
    })
    .state('menu.legal', {
        url: '/legal',
        templateUrl: 'templates/legal.html',
        controller: 'LegalCtrl'
    })
    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'templates/main.html'
    })
    .state('main.login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('main.register', {
        url: '/register',
        templateUrl: 'templates/register.html',
    })
    .state('main.userinfo', {
        url: '/userinfo',
        templateUrl: 'templates/userinfo.html',
    })
    .state('main.areas', {
        url: '/areas',
        templateUrl: 'templates/areas.html',
        controller: 'AreasCtrl'
    })
    .state('main.areadetail', {
        url: '/area/:id',
        templateUrl: 'templates/area.detail.html',
        controller: 'AreaDetailCtrl'
    })
    .state('main.areadetailcards', {
        url: '/area/:id/cards',
        templateUrl: 'templates/area.detail.cards.html',
        controller: 'AreaDetailCardCtrl'
    })
    .state('main.cards', {
        url: '/cards',
        templateUrl: 'templates/cards.html'
    })
    .state('main.favorites', {
        url: '/favorites',
        templateUrl: 'templates/favorites.html'
    })
    .state('main.fishes', {
        url: '/fishes',
        templateUrl: 'templates/fishes.html'
    })
    .state('main.methods', {
        url: '/methods',
        templateUrl: 'templates/methods.html'
    })
    .state('main.report', {
        url: '/report',
        templateUrl: 'templates/report.html'
    })

})

