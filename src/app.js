// 'ifiske' is the name of this angular module (also set in a <body> attribute in index.html)

angular.module('ifiske', [
    'ionic',
    'ionic.cloud',
    'ionic.ion.headerShrink',
    'ifiske.controllers',
    'ifiske.directives',
    'ifiske.services',
    'ifiske.models',
    'ngCordova',
    'systemBrowser',
    'ngCordovaSms',
    'ngMessages',
    'ImgCache',
    'ui-leaflet',
    'pascalprecht.translate',
    'ifiske.translations',
])

.constant('$ionicLoadingConfig', {
    template: '<ion-spinner></ion-spinner>',
    // hideOnStateChange: true
})
.constant('serverLocation', 'https://www.ifiske.se')
.run(function(
    $ionicPlatform,
    $window,
    ImgCache,
    $rootScope,
    $timeout,
    $translate,
    localStorage,
    Update,
    Push,
    Settings,
    serverLocation
) {
    $rootScope.image_endpoint = serverLocation; // eslint-disable-line camelcase

    $ionicPlatform.ready(function() {
        Push.init();

        if ($ionicPlatform.is('Android') && $window.MobileAccessibility) {
            $window.MobileAccessibility.usePreferredTextZoom(false);
            console.log("Preferred text zoom disabled");
        }

        if ($window.StatusBar) {
            // org.apache.cordova.statusbar required
            $window.StatusBar.styleDefault();
        }

        ImgCache.$init();
        if (localStorage.get('language')) {
            $translate.use(Settings.language());
            Update.update().catch(function(err) {
                console.error(err);
            });
        }

        if ($window.navigator && $window.navigator.splashscreen) {
            $timeout(function() {
                $window.navigator.splashscreen.hide();
            }, 500);
        }
    });
})

.config(function(
    $stateProvider,
    $urlRouterProvider,
    $ionicConfigProvider,
    ImgCacheProvider,
    $ionicCloudProvider,
    $translateProvider,
    swedishTranslations,
    germanTranslations,
    englishTranslations
) {
    $translateProvider
    .translations('se', swedishTranslations)
    .translations('de', germanTranslations)
    .translations('en', englishTranslations)
    .determinePreferredLanguage()
    .fallbackLanguage(['en', 'se']);

    /* eslint-disable camelcase */
    $ionicCloudProvider.init({
        core: {
            app_id: "46a4a954",
        },
        push: {
            sender_id:    "196216212249",
            pluginConfig: {
                ios: {
                    badge: true,
                    sound: true,
                },
                android: {
                    iconColor: "#00ff00",
                },
            },

        },
    });
    /* eslint-enable camelcase */

    ImgCacheProvider.setOptions({
        debug:              false,
        usePersistentCache: true,
    });
    ImgCacheProvider.manualInit = true;

    // Disable swipe to go back since it is bugged
    $ionicConfigProvider.views.swipeBackEnabled(false);

    // Cache views in the forward stack
    $ionicConfigProvider.views.forwardCache(true);

    // Sets all transitions to use android-style, since that looks better with transparent backgrounds
    $ionicConfigProvider.views.transition('android');

    // Clear back button default text
    $ionicConfigProvider.backButton.previousTitleText(false).text('');

    // Tabs position
    $ionicConfigProvider.tabs.position('bottom');

    /**
    * Ionic uses AngularUI Router. Learn more here:
    * https://github.com/angular-ui/ui-router
    */

    var defaultUrl = '/app/login';
    if (!window.localStorage.getItem('language')) {
        defaultUrl = '/app/language';
    } else if (window.localStorage.getItem('session')) {
        defaultUrl = '/app/home';
    }
    $urlRouterProvider.otherwise(defaultUrl);

    $stateProvider
    .state('app', {
        url:         '/app',
        // abstract: true,
        templateUrl: 'components/menu/menu.html',
        controller:  'MenuCtrl',
    })
    .state('app.home', {
        url:         '/home',
        templateUrl: 'components/home/home.html',
        controller:  'HomeCtrl',
    })

    .state('app.settings', {
        url:         '/settings',
        templateUrl: 'components/settings/settings.html',
        controller:  'SettingsCtrl',
    })

    .state('app.settings.main', {
        url:         '/main',
        templateUrl: 'components/settings/main.html',
    })

    .state('app.settings.about', {
        url:         '/about',
        templateUrl: 'components/settings/about.html',
    })

    .state('app.settings.foss', {
        url:         '/foss',
        templateUrl: 'components/settings/foss/foss.html',
        controller:  'FossController',
    })

    .state('app.settings.bugs', {
        url:         '/info',
        templateUrl: 'components/settings/bugs.html',
    })

    .state('app.language', {
        url:         '/language',
        templateUrl: 'components/languageSwitcher/languageSwitcher.html',
        controller:  'languageSwitcher',
    })

    .state('app.login', {
        url:         '/login',
        templateUrl: 'components/login/login.html',
        controller:  'LoginCtrl',
    })

    // Account recovery
    .state('app.recover', {
        url:         '/recover',
        templateUrl: 'components/recover/recover.html',
        controller:  'RecoverCtrl',
    })
    .state('app.recover.lostpassword', {
        url:         '/lostpassword',
        templateUrl: 'components/recover/lostpassword.html',
    })
    .state('app.recover.resetpassword', {
        url:         '/resetpassword',
        templateUrl: 'components/recover/resetpassword.html',
    })

    // Account registration
    .state('app.register', {
        url:         '/register',
        templateUrl: 'components/register/register.html',
        controller:  'RegisterCtrl',
    })
    .state('app.register.fork', {
        url:         '/fork',
        templateUrl: 'components/register/register_fork.html',
    })
    .state('app.register.details', {
        url:         '/details',
        templateUrl: 'components/register/register_details.html',
    })
    .state('app.register.verify', {
        url:         '/verify',
        templateUrl: 'components/register/register_verify.html',
        controller:  'RegisterVerifyCtrl',
    })
    .state('app.register.verify2', {
        url:         '/verify2',
        templateUrl: 'components/register/register_verify2.html',
        controller:  'RegisterVerifyCtrl',
    })

    .state('app.contact', {
        url:         '/contact',
        templateUrl: 'components/contact/contact.html',
        controller:  'ContactCtrl',
    })
    .state('app.legal', {
        url:         '/legal',
        templateUrl: 'components/legal/legal.html',
        controller:  'LegalCtrl',
    })
    .state('app.userinfo', {
        url:         '/userinfo',
        controller:  'UserCtrl',
        templateUrl: 'components/user/user.html',
    })
    .state('app.find_areas', {
        url:         '/find_areas',
        templateUrl: 'components/find_areas/tabs.html',
        controller:  'FindAreasCtrl',
    })
    .state('app.find_areas.counties', {
        url:   '/counties',
        views: {
            'ionic-tabs': {
                templateUrl: 'components/find_areas/counties.html',
                controller:  'CountiesCtrl',
            },
        },
    })
    .state('app.find_areas.favorites', {
        url:   '/favorites',
        views: {
            'ionic-tabs': {
                templateUrl: 'components/find_areas/favorites.html',
                controller:  'FavoritesCtrl',
            },
        },
    })
    .state('app.cards', {
        url:         '/cards',
        templateUrl: 'components/user_cards/user_cards.html',
        controller:  'UserCardsCtrl',
    })

    // Admin
    .state('app.admin', {
        url:         '/admin/:id',
        templateUrl: 'components/admin/admin.html',
        controller:  'AdminCtrl',
        params:      {id: false, org: false},
    })
    .state('app.admin_product', {
        url:         '/admin/:id/product/:productID',
        templateUrl: 'components/admin/product/product.html',
        controller:  'AdminProductCtrl',
        params:      {id: false, productID: false, product: false},
    })

    .state('app.areas', {
        url:    '/areas',
        params: {
            id:     false,
            county: false,
            search: '',
        },
        templateUrl: 'components/area_list/area_list.html',
        controller:  'AreasCtrl',
    })
    .state('app.report', {
        url:    '/report/:id',
        params: {
            id: false,
        },
        templateUrl: 'components/report/report.html',
        controller:  'ReportCtrl',
    })
    .state('app.create_report', {
        url:    '/create_report',
        params: {
            orgid: false,
            code:  false,
        },
        templateUrl: 'components/create_report/create_report.html',
        controller:  'CreateReportCtrl',
    })
    .state('app.license_detail', {
        url:    '/license/:id',
        params: {
            id:      false,
            license: false,
        },
        templateUrl: 'components/license_detail/license_detail.html',
        controller:  'LicenseDetailCtrl',
    })
    .state('app.fishes', {
        url:         '/fishes',
        templateUrl: 'components/fishes/fishes.html',
        controller:  'FishesCtrl',
    })
    .state('app.fishdetail', {
        url:    '/fishdetail/:id',
        params: {
            id:   false,
            fish: false,
        },
        templateUrl: 'components/fish_detail/fish_detail.html',
        controller:  'FishDetailCtrl',
    })
    .state('app.map', {
        url:         '/map',
        templateUrl: 'components/map/map.html',
        controller:  'MapCtrl',
    })
    .state('app.techniques', {
        url:         '/techniques',
        templateUrl: 'components/techniques/techniques.html',
        controller:  'TechniquesCtrl',
    })
    .state('app.techniquedetail', {
        url:    '/techniquedetail/:id',
        params: {
            id:   false,
            tech: false,
        },
        templateUrl: 'components/technique_detail/technique_detail.html',
        controller:  'TechniqueDetailCtrl',
    })
    .state('app.news', {
        url:         '/news',
        templateUrl: 'components/news/news.html',
        controller:  'NewsCtrl',
    })
    .state('app.newsitem', {
        url:    '/news/:id',
        params: {
            item: false,
            id:   false,
        },
        templateUrl: 'components/news/newsitem.html',
        controller:  'NewsItemCtrl',
    })

    .state('app.area', {
        url:         '/area/:id',
        templateUrl: 'components/area/area.html',
        controller:  'AreaCtrl',
    })
    .state('app.area.info', {
        url:   '/info',
        views: {
            'ionic-tabs': {
                templateUrl: 'components/area/info.html',
                controller:  'AreaInfoCtrl',
            },
        },
    })
    .state('app.area.map', {
        url:   '/map',
        views: {
            'ionic-tabs': {
                templateUrl: 'components/area/map.html',
                controller:  'AreaMapCtrl',
            },
        },
    })
    .state('app.area.fish', {
        url:   '/fish',
        views: {
            'ionic-tabs': {
                templateUrl: 'components/area/fish.html',
                controller:  'AreaFishCtrl',
            },
        },
    })
    .state('app.area.cards', {
        url:   '/cards',
        views: {
            'ionic-tabs': {
                templateUrl: 'components/area/cards.html',
                controller:  'AreaCardsCtrl',
            },
        },
    });
});

angular.module('ifiske.controllers', []);
angular.module('ifiske.directives', []);
angular.module('ifiske.services', []);
angular.module('ifiske.models', []);
angular.module('ifiske.translations', []);
