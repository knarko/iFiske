// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ifiske' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ifiske.controllers' is found in controllers.js

angular.module('ifiske', [
    'ionic',
    'ifiske.controllers',
    'ifiske.directives',
    'ifiske.api',
    'ifiske.db',
    'ifiske.utils',
    'ifiske.update',
    'ifiske.filters',
    'ionic.ion.headerShrink',
    'ngCordova',
    'systemBrowser',
    'ngCordovaSms',
    'ngMessages',
    'ImgCache',
    'leaflet-directive',
    'tabSlideBox'
])
.constant('$ionicLoadingConfig', {
    template: '<ion-spinner></ion-spinner>'
    // hideOnStateChange: true
})
.run(['$ionicPlatform', 'Update', 'ImgCache', function($ionicPlatform, Update, ImgCache) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar above the keyboard for form inputs
        if (window.ionic && window.ionic.Keyboard) {
            window.ionic.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            window.StatusBar.styleDefault();
        }

        ImgCache.$init();
        Update.update();
    });
}])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$ionicConfigProvider',
    'ImgCacheProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ImgCacheProvider) {

        ImgCacheProvider.setOptions({
            debug: false,
            usePersistentCache: true
        });
        ImgCacheProvider.manualInit = true;

        // Cache views in the forward stack
        $ionicConfigProvider.views.forwardCache(true);

        // Clear back button default text
        $ionicConfigProvider.backButton.previousTitleText(false).text('');

        // Tabs position
        $ionicConfigProvider.tabs.position('bottom');

        /**
         * Ionic uses AngularUI Router. Learn more here:
         * https://github.com/angular-ui/ui-router
         */

        var defaultUrl = '/start/login';
        if (window.localStorage.getItem('session')) {
            defaultUrl = '/menu/home';
        }
        $urlRouterProvider.otherwise(defaultUrl);

        $stateProvider
        // Abstract pre-menu state. Needed for navigation between login and register views.
        .state('start', {
            url: '/start',
            abstract: true,
            templateUrl: 'components/start/start.html'
        })
        .state('start.login', {
            url: '/login',
            templateUrl: 'components/login/login.html',
            controller: 'LoginCtrl'
        })
        .state('start.register', {
            url: '/register',
            templateUrl: 'components/register/register.html',
            controller: 'RegisterCtrl'
        })
        .state('start.register.details', {
            url: '/details',
            templateUrl: 'components/register/register_details.html'
        })
        .state('start.register.verify', {
            url: '/verify',
            templateUrl: 'components/register/register_verify.html'
        })

        // Abstract menu state. "Root" state once we're past the login state.
        .state('menu', {
            url: '/menu',
            abstract: true,
            templateUrl: 'components/menu/menu.html',
            controller: 'MenuCtrl'
        })
        .state('menu.home', {
            url: '/home',
            templateUrl: 'components/home/home.html',
            controller: 'HomeCtrl'
        })
        .state('menu.info', {
            url: '/info',
            templateUrl: 'components/info/info.html'
        })
        .state('menu.bugs', {
            url: '/info',
            templateUrl: 'components/menu/report.html'
        })
        .state('menu.contact', {
            url: '/contact',
            templateUrl: 'components/contact/contact.html',
            controller: 'ContactCtrl'
        })
        .state('menu.legal', {
            url: '/legal',
            templateUrl: 'components/legal/legal.html',
            controller: 'LegalCtrl'
        })
        .state('menu.about', {
            url: '/about',
            templateUrl: 'components/about/about.html',
            controller: 'AboutCtrl'
        })
        .state('menu.userinfo', {
            url: '/userinfo',
            controller: 'UserCtrl',
            templateUrl: 'components/user/user.html',
        })
        .state('menu.counties', {
            url: '/counties',
            templateUrl: 'components/counties/counties.html',
            controller: 'CountiesCtrl'
        })
        .state('menu.areas', {
            url: '/areas',
            params: {'id': false, 'county': false, 'search': ''},
            templateUrl: 'components/area_list/area_list.html',
            controller: 'AreasCtrl'
        })
        .state('menu.cards', {
            url: '/cards',
            templateUrl: 'components/user_cards/user_cards.html',
            controller: 'UserCardsCtrl'
        })
        .state('menu.favorites', {
            url: '/favorites',
            templateUrl: 'components/favorites/favorites.html'
        })
        .state('menu.fishes', {
            url: '/fishes',
            templateUrl: 'components/fishes/fishes.html',
            controller: 'FishesCtrl'
        })
        .state('menu.fishdetail', {
            url: '/fishdetail/:id',
            params: {'id': false, 'fish': false},
            templateUrl: 'components/fish_detail/fish_detail.html',
            controller: 'FishDetailCtrl'
        })
        .state('menu.map', {
            url: '/map',
            templateUrl: 'components/map/map.html',
            controller: 'MapCtrl'
        })
        .state('menu.techniques', {
            url: '/techniques',
            templateUrl: 'components/techniques/techniques.html',
            controller: 'TechniquesCtrl'
        })
        .state('menu.techniquedetail', {
            url: '/techniquedetail/:id',
            params: {'id': false, 'tech': false},
            templateUrl: 'components/technique_detail/technique_detail.html',
            controller: 'TechniqueDetailCtrl'
        })
        .state('menu.report', {
            url: '/report',
            templateUrl: 'components/report/report.html'
        })

        .state('menu.area', {
            url: '/area/:id',
            views: {
                '@menu': {
                    templateUrl: 'components/area/area.html',
                    controller: 'AreaCtrl',
                },
                'info@menu.area': {
                    templateUrl: 'components/area/info.html'
                },
                'map@menu.area': {
                    templateUrl: 'components/area/map.html'
                },
                'fishinfo@menu.area': {
                    templateUrl: 'components/area/fish.html'
                },
                'cards@menu.area': {
                    templateUrl: 'components/area/cards.html'
                }
            }
        });
    }
]);

angular.module('ifiske.controllers', []);
angular.module('ifiske.directives', []);
