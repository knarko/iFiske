/* eslint-disable camelcase */
(function() {
    var settings = {
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
    };

    var recover = {
        config: {
            url:         '/recover',
            templateUrl: 'components/recover/recover.html',
            controller:  'RecoverCtrl',
        },
        children: {
            lostpassword: {
                url:         '/lostpassword',
                templateUrl: 'components/recover/lostpassword.html',
            },
            resetpassword: {
                url:         '/resetpassword',
                templateUrl: 'components/recover/resetpassword.html',
            },
        },
    };

    var register = {
        config: {
            url:         '/register',
            templateUrl: 'components/register/register.html',
            controller:  'RegisterCtrl',
        },
        children: {
            fork: {
                url:         '/fork',
                templateUrl: 'components/register/register_fork.html',
            },
            details: {
                url:         '/details',
                templateUrl: 'components/register/register_details.html',
            },
            verify: {
                url:         '/verify',
                templateUrl: 'components/register/register_verify.html',
                controller:  'RegisterVerifyCtrl',
            },
            verify2: {
                url:         '/verify2',
                templateUrl: 'components/register/register_verify2.html',
                controller:  'RegisterVerifyCtrl',
            },
        },
    };
    var find_areas = {
        config: {
            url:         '/find_areas',
            templateUrl: 'components/find_areas/tabs.html',
            controller:  'FindAreasCtrl',
        },
        children: {
            counties: {
                url:   '/counties',
                views: {
                    'ionic-tabs': {
                        templateUrl: 'components/find_areas/counties.html',
                        controller:  'CountiesCtrl',
                    },
                },
            },
            favorites: {
                url:   '/favorites',
                views: {
                    'ionic-tabs': {
                        templateUrl: 'components/find_areas/favorites.html',
                        controller:  'FavoritesCtrl',
                    },
                },
            },
        },
    };
    var admin = {
        config: {
            url:         '/admin',
            templateUrl: 'components/admin/admin_wrap.html',
            controller:  'AdminWrapCtrl',
        },
        children: {
            main: {
                url:         '/main',
                templateUrl: 'components/admin/main.html',
                controller:  'AdminCtrl',
            },
            org: {
                url:         '/org/:id',
                templateUrl: 'components/admin/admin.html',
                controller:  'AdminOrgCtrl',
                params:      {id: undefined, org: false},
            },
            licenses: {
                url:         '/licenses?name',
                templateUrl: 'components/admin/licenses.html',
                controller:  'AdminLicenseCtrl',
                params:      {license: false, name: undefined},
            },
            product: {
                url:         '/product?productID&code',
                templateUrl: 'components/admin/product/product.html',
                controller:  'AdminProductCtrl',
                params:      {code: undefined, productID: undefined, product: false},
            },
        },
    };
    var area = {
        config: {
            url:         '/area/:id',
            templateUrl: 'components/area/area.html',
            controller:  'AreaCtrl',
        },
        children: {
            info: {
                url:   '/info',
                views: {
                    'ionic-tabs': {
                        templateUrl: 'components/area/info.html',
                        controller:  'AreaInfoCtrl',
                    },
                },
            },
            map: {
                url:   '/map',
                views: {
                    'ionic-tabs': {
                        templateUrl: 'components/area/map.html',
                        controller:  'AreaMapCtrl',
                    },
                },
            },
            fish: {
                url:   '/fish',
                views: {
                    'ionic-tabs': {
                        templateUrl: 'components/area/fish.html',
                        controller:  'AreaFishCtrl',
                    },
                },
            },
            cards: {
                url:   '/cards',
                views: {
                    'ionic-tabs': {
                        templateUrl: 'components/area/cards.html',
                        controller:  'AreaCardsCtrl',
                    },
                },
            },
        },
    };

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
                    url:         '/home',
                    templateUrl: 'components/home/home.html',
                    controller:  'HomeCtrl',
                },

                language: {
                    url:         '/language',
                    templateUrl: 'components/languageSwitcher/languageSwitcher.html',
                    controller:  'languageSwitcher',
                },

                login: {
                    url:         '/login',
                    templateUrl: 'components/login/login.html',
                    controller:  'LoginCtrl',
                },
                contact: {
                    url:         '/contact',
                    templateUrl: 'components/contact/contact.html',
                    controller:  'ContactCtrl',
                },
                legal: {
                    url:         '/legal',
                    templateUrl: 'components/legal/legal.html',
                    controller:  'LegalCtrl',
                },
                userinfo: {
                    url:         '/userinfo',
                    controller:  'UserCtrl',
                    templateUrl: 'components/user/user.html',
                },
                areas: {
                    url:         '/areas?id',
                    templateUrl: 'components/area_list/area_list.html',
                    controller:  'AreasCtrl',
                    params:      {
                        id:     undefined,
                        county: '',
                        search: '',
                    },
                },
                report: {
                    url:         '/report/:id',
                    templateUrl: 'components/report/report.html',
                    controller:  'ReportCtrl',
                    params:      {
                        id: false,
                    },
                },
                create_report: {
                    url:         '/create_report',
                    templateUrl: 'components/create_report/create_report.html',
                    controller:  'CreateReportCtrl',
                    params:      {
                        orgid: false,
                        code:  false,
                    },
                },
                license_detail: {
                    url:         '/license/:id',
                    templateUrl: 'components/license_detail/license_detail.html',
                    controller:  'LicenseDetailCtrl',
                    params:      {
                        id:      false,
                        license: false,
                    },
                },
                fishes: {
                    url:         '/fishes',
                    templateUrl: 'components/fishes/fishes.html',
                    controller:  'FishesCtrl',
                },
                fishdetail: {
                    url:         '/fishdetail/:id',
                    templateUrl: 'components/fish_detail/fish_detail.html',
                    controller:  'FishDetailCtrl',
                    params:      {
                        id:   false,
                        fish: false,
                    },
                },
                map: {
                    url:         '/map',
                    templateUrl: 'components/map/map.html',
                    controller:  'MapCtrl',
                },
                techniques: {
                    url:         '/techniques',
                    templateUrl: 'components/techniques/techniques.html',
                    controller:  'TechniquesCtrl',
                },
                techniquedetail: {
                    url:         '/techniquedetail/:id',
                    templateUrl: 'components/technique_detail/technique_detail.html',
                    controller:  'TechniqueDetailCtrl',
                    params:      {
                        id:   false,
                        tech: false,
                    },
                },
                news: {
                    url:         '/news',
                    templateUrl: 'components/news/news.html',
                    controller:  'NewsCtrl',
                },
                newsitem: {
                    url:         '/news/:id',
                    templateUrl: 'components/news/newsitem.html',
                    controller:  'NewsItemCtrl',
                    params:      {
                        item: false,
                        id:   false,
                    },
                },
                cards: {
                    url:         '/cards',
                    templateUrl: 'components/user_cards/user_cards.html',
                    controller:  'UserCardsCtrl',
                },

                settings:   settings,
                recover:    recover,
                register:   register,
                find_areas: find_areas,
                admin:      admin,
                area:       area,
            },
        },
    });
})();
