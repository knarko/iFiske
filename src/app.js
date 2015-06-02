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

        //Disable swipe to go back since it is bugged
        $ionicConfigProvider.views.swipeBackEnabled(false);

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

        var defaultUrl = '/app/login';
        if (window.localStorage.getItem('session')) {
            defaultUrl = '/app/home';
        }
        $urlRouterProvider.otherwise(defaultUrl);

        $stateProvider

        .state('app', {
            url: '/app',
            //abstract: true,
            templateUrl: 'components/menu/menu.html',
            controller: 'MenuCtrl'
        })

        .state('app.login', {
            url: '/login',
            templateUrl: 'components/login/login.html',
            controller: 'LoginCtrl'
        })

        // Account recovery
        .state('app.recover', {
            url: '/recover',
            templateUrl: 'components/recover/recover.html',
            controller: 'RecoverCtrl'
        })
        .state('app.recover.lostpassword', {
            url: '/lostpassword',
            templateUrl: 'components/recover/lostpassword.html'
        })
        .state('app.recover.resetpassword', {
            url: '/resetpassword',
            templateUrl: 'components/recover/resetpassword.html'
        })

        // Account registration
        .state('app.register', {
            url: '/register',
            templateUrl: 'components/register/register.html',
            controller: 'RegisterCtrl'
        })
        .state('app.register.details', {
            url: '/details',
            templateUrl: 'components/register/register_details.html'
        })
        .state('app.register.verify', {
            url: '/verify',
            templateUrl: 'components/register/register_verify.html'
        })

        //
        .state('app.home', {
            url: '/home',
            templateUrl: 'components/home/home.html',
            controller: 'HomeCtrl'
        })
        .state('app.info', {
            url: '/info',
            templateUrl: 'components/info/info.html'
        })

        .state('app.bugs', {
            url: '/info',
            templateUrl: 'components/menu/report.html'
        })
        .state('app.contact', {
            url: '/contact',
            templateUrl: 'components/contact/contact.html',
            controller: 'ContactCtrl'
        })
        .state('app.legal', {
            url: '/legal',
            templateUrl: 'components/legal/legal.html',
            controller: 'LegalCtrl'
        })
        .state('app.about', {
            url: '/about',
            templateUrl: 'components/about/about.html',
            controller: 'AboutCtrl'
        })
        .state('app.userinfo', {
            url: '/userinfo',
            controller: 'UserCtrl',
            templateUrl: 'components/user/user.html',
        })

        .state('app.counties', {
            url: '/counties',
            templateUrl: 'components/counties/counties.html',
            controller: 'CountiesCtrl'
        })
        .state('app.areas', {
            url: '/areas',
            params: {'id': false, 'county': false, 'search': ''},
            templateUrl: 'components/area_list/area_list.html',
            controller: 'AreasCtrl'
        })
        .state('app.cards', {
            url: '/cards',
            templateUrl: 'components/user_cards/user_cards.html',
            controller: 'UserCardsCtrl'
        })
        .state('app.favorites', {
            url: '/favorites',
            templateUrl: 'components/favorites/favorites.html'
        })
        .state('app.fishes', {
            url: '/fishes',
            templateUrl: 'components/fishes/fishes.html',
            controller: 'FishesCtrl'
        })
        .state('app.fishdetail', {
            url: '/fishdetail/:id',
            params: {'id': false, 'fish': false},
            templateUrl: 'components/fish_detail/fish_detail.html',
            controller: 'FishDetailCtrl'
        })
        .state('app.map', {
            url: '/map',
            templateUrl: 'components/map/map.html',
            controller: 'MapCtrl'
        })
        .state('app.techniques', {
            url: '/techniques',
            templateUrl: 'components/techniques/techniques.html',
            controller: 'TechniquesCtrl'
        })
        .state('app.techniquedetail', {
            url: '/techniquedetail/:id',
            params: {'id': false, 'tech': false},
            templateUrl: 'components/technique_detail/technique_detail.html',
            controller: 'TechniqueDetailCtrl'
        })
        .state('app.area', {
            url: '/area/:id',
            views: {
                '@app': {
                    templateUrl: 'components/area/area.html',
                    controller: 'AreaCtrl',
                },
                'info@app.area': {
                    templateUrl: 'components/area/info.html',
                    controller: 'AreaInfoCtrl'
                },
                'map@app.area': {
                    templateUrl: 'components/area/map.html',
                    controller: 'AreaMapCtrl'
                },
                'fishinfo@app.area': {
                    templateUrl: 'components/area/fish.html',
                    controller: 'AreaFishCtrl'
                },
                'cards@app.area': {
                    templateUrl: 'components/area/cards.html',
                    controller: 'AreaCardsCtrl'
                }
            }
        });
    }]);

angular.module('ifiske.controllers', []);
angular.module('ifiske.directives', []);
