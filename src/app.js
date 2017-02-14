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
    'pascalprecht.translate',
    'ifiske.translations',
    'chart.js',
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
    localStorage,
    Update,
    Push,
    analytics,
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
            // cordova-plugin-statusbar required
            $window.StatusBar.styleLightContent();
            if ($ionicPlatform.is('Android')) {
                // Color slightly darker than our navigation bar
                $window.StatusBar.backgroundColorByHexString("#001f2d");
            }
        }

        ImgCache.$init();
        if (localStorage.get('language')) {
            analytics.trackEvent('Language', 'initialized', localStorage.get('language'));
            Update.update().catch(function(err) {
                console.error(err);
            });
        }

        if ($window.navigator && $window.navigator.splashscreen) {
            $timeout(function() {
                $window.navigator.splashscreen.hide();
            }, 500);
        }
        // analytics.debugMode(); // enable when debugging
        analytics.startTrackerWithId('UA-7371664-4');
        analytics.enableUncaughtExceptionReporting(true);

        $rootScope.$on('$stateChangeSuccess',
            function(_event, toState, toParams, _fromState, _fromParams) {
                analytics.trackView(toState.name + '(' + (toParams.id || '') + ')');
            });
    });
})

.config(function(
    $stateProvider,
    States,
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
    .translations('en_GB', englishTranslations)
    .determinePreferredLanguage()
    .fallbackLanguage(['en', 'se'])
    .useSanitizeValueStrategy('sanitizeParameters')
    .useMissingTranslationHandlerLog();
    var language = localStorage.getItem('language');
    if (language) {
        $translateProvider.preferredLanguage(language);
    } else {
        $translateProvider.determinePreferredLanguage();
    }

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

    function parseStates(name, state) {
        if (state.config) {
            $stateProvider.state(name, state.config);
        } else {
            $stateProvider.state(name, state);
        }
        if (state.children) {
            Object.keys(state.children).forEach(function(stateName) {
                parseStates(name + '.' + stateName, state.children[stateName]);
            });
        }
    }
    parseStates('app', States.app);
});

angular.module('ifiske.controllers', []);
angular.module('ifiske.directives', []);
angular.module('ifiske.services', []);
angular.module('ifiske.models', []);
angular.module('ifiske.translations', []);
