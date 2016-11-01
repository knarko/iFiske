angular.module('ifiske')
.constant('States', {
    app: {
        config: {
            url:         '/app',
            // abstract: true,
            templateUrl: 'components/menu/menu.html',
            controller:  'MenuCtrl',
        },
        children: {
            home: {
                config: {
                    url:         '/home',
                    templateUrl: 'components/home/home.html',
                    controller:  'HomeCtrl',
                },
                children: {},
            },

            settings: {
                config: {
                    url:         '/settings',
                    templateUrl: 'components/settings/settings.html',
                    controller:  'SettingsCtrl',
                },
                children: {
                    main: {
                        config: {
                            url:         '/main',
                            templateUrl: 'components/settings/main.html',
                        },
                    },
                    about: {
                        config: {
                            url:         '/about',
                            templateUrl: 'components/settings/about.html',
                        },
                    },
                    foss: {
                        config: {
                            url:         '/foss',
                            templateUrl: 'components/settings/foss/foss.html',
                            controller:  'FossController',
                        },
                    },
                    bugs: {
                        config: {
                            url:         '/info',
                            templateUrl: 'components/settings/bugs.html',
                        },
                    },
                },
            },
        },
    },
});
