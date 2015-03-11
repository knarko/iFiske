// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ifiske' is the name of this angular module example (also set in a <body> attribute in index.html)
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
    'ImgCache'
])
.constant('$ionicLoadingConfig', {
    template: '<i class="icon ion-loading-b"></i>'
    // hideOnStateChange: true
})
.run(['$ionicPlatform', 'Update', 'ImgCache', function($ionicPlatform, Update, ImgCache) {
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

        ImgCache.$init();
        Update.update();
    });
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 'ImgCacheProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ImgCacheProvider) {

    ImgCacheProvider.setOptions({
        debug: true,
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
    .state('start.register.accountDetails', {
        url: '/account_details',
        templateUrl: 'components/register/register_account_details.html'
    })
    .state('start.register.userDetails', {
        url: '/user_details',
        templateUrl: 'components/register/register_user_details.html'
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

    .state('areadetail2', {
        abstract:true,
        url: '/areadetail/:id',
        templateUrl: 'components/area2/area.html',
        controller: 'AreaCtrl'
    })
    .state('areadetail2.info', {
        url: '/info',
        views: {
            'info': {
                templateUrl: 'components/area/area.html'
            }
        }
    })
    .state('areadetail2.fishinfo', {
        url: '/fishinfo',
        views: {
            'fishinfo': {
                templateUrl: 'components/area_fish/area_fish.html'
            }
        }
    })
    .state('areadetail2.cards', {
        url: '/cards',
        views: {
            'cards': {
                templateUrl: 'components/area_cards/area_cards.html'
            }
        }
    });
}]);

angular.module('ifiske.controllers', []);
angular.module('ifiske.directives', []);

angular.module('ifiske.controllers')
    .controller('AboutCtrl', ['$scope','$cordovaAppVersion', '$ionicPlatform', 'Update', function($scope, $cordovaAppVersion, $ionicPlatform, Update) {
	$scope.version = $scope.dbDate = 'Ok\u00E4nt';
    $scope.dbDate = Update.last_update();

	$ionicPlatform.ready(function() {
	    if (window.cordova) {
		$cordovaAppVersion.getAppVersion().then(function(version) {
		    console.log(version);
		    $scope.version = version;
		});
	    }
	});
}]);

angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$ionicHistory',
    'localStorage',
    '$rootScope',
    '$ionicViewSwitcher',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    '$ionicModal',
    function($scope, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher, $stateParams, DB, $ionicSlideBoxDelegate, $ionicModal) {

        $scope.tabsBack = function() {
            // If the current view is at the top of its history stack
            if(!$ionicHistory.viewHistory().currentView.index) {
                /**
                 * Switch to the home history stack
                 * See $ionicHistory source for the even handler used
                 * See home_controller.js for the historyId used
                 */
                $ionicViewSwitcher.nextDirection('back');
                $scope.$emit('$ionicHistory.change', {
                    historyId: localStorage.get('homeHistoryId')
                });
            } else {
                // Default back action
                $rootScope.$ionicGoBack();
            }
        };

        $scope.image_endpoint = 'http://www.ifiske.se';

        // Areainfo
        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.images = area.images;

            $ionicSlideBoxDelegate.update();
            $scope.area = area;

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
            console.log(fishes);
            $scope.fishes = fishes;
        }, function(err) {
             console.log(err);
        });

        DB.getProductsByArea($stateParams.id)
        .then(function(products) {
            $scope.products = products;
        }, function(err) {
            console.log(err);
        });

        // Area fishes
        $scope.sortorder = '-amount';

        //Area_Cards
        $scope.smsterms = localStorage.get('sms_terms');
        $scope.predicate = "so";


        //SMS-modal
        $ionicModal.fromTemplateUrl('components/area_cards/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.sms_modal = modal;
        });
        $scope.openModal = function(product) {
            $scope.sms_modal.show();
            $scope.product = product;
        };
        $scope.closeModal = function() {
            $scope.sms_modal.hide();
        };
        $scope.showTerms = function($event) {
            $scope.showingterms = !$scope.showingterms;
        };
        $scope.showingterms = false;

        //Rules modal
        $ionicModal.fromTemplateUrl('components/area_cards/rules_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.rules_modal = modal;
        });
        $scope.openRulesModal = function(product) {
            $scope.rules_modal.show();
            $scope.product = product;
        };
        $scope.closeRulesModal = function() {
            $scope.rules_modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.sms_modal.remove();
            $scope.rules_modal.remove();
        });

    }
]);

angular.module('ifiske.controllers')
.controller('AreasCtrl', ['$scope', '$stateParams', '$ionicScrollDelegate' ,'DB', function($scope, $stateParams, $ionicScrollDelegate ,DB) {

    $scope.search = {'$': $stateParams.search};
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

}]);


angular.module('ifiske.controllers')
.controller('ContactCtrl', ['$scope', '$state', 'localStorage', function($scope, $state, localStorage) {
        $scope.contactInfo = localStorage.get('contactInfo');
}]);

angular.module('ifiske.controllers')
.controller('CountiesCtrl', ['$scope', 'DB', function($scope, DB) {
    DB.getCounties()
    .then(function(data) {
        $scope.counties = data;
    }, function(err) {
        console.log(err);
    });
}]);

angular.module('ifiske.controllers')
.controller('FishDetailCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.fish = $stateParams.fish;
    $scope.image_endpoint = 'http://www.ifiske.se';
    if(!$scope.fish) {
        DB.getFish($stateParams.id)
        .then(function(data) {
            $scope.fish = data;
    console.log($scope.fish);
        }, function(err) {
            console.log(err);
        });
    }
    console.log($scope.fish);
}]);

angular.module('ifiske.controllers')
.controller('FishesCtrl', ['$scope', 'DB', function($scope, DB) {
    $scope.sortorder = 'so';
    $scope.image_endpoint = 'http://www.ifiske.se';
    DB.getFishes()
    .then(function(data) {
        $scope.fishes = data;
        $scope.default_img = data[0].img;
    }, function(err) {
        console.log(err);
    });
}]);

angular.module('ifiske.controllers')
.controller('HomeCtrl', [
    '$scope',
    '$state',
    '$ionicHistory',
    'localStorage',
    'sessionData',
    function($scope, $state, $ionicHistory, localStorage, sessionData) {

        $scope.loggedIn = sessionData;

        // Current history stack Id. See area_controller for usage.
        localStorage.set('homeHistoryId', $ionicHistory.currentHistoryId());

        $scope.myFunc = function($event) {
            if($event.keyCode == 13 && !$event.shiftKey) { //if enter-key
                $state.go('menu.areas', {search: $event.srcElement.value});
            }

        };
    }
]);

angular.module('ifiske.controllers')
.controller('LegalCtrl', ['$scope', '$state', 'localStorage', function($scope, $state, localStorage) {
    $scope.tos = localStorage.get('tos');
}]);

angular.module('ifiske.controllers')
.controller('LoginCtrl', ['$scope', '$state', 'Update', '$ionicLoading', function($scope, $state, Update, $ionicLoading) {
    //$scope.user = {};
    $scope.signIn = function(loginForm) {
        $ionicLoading.show();

        Update.user_login(loginForm.username.$viewValue, loginForm.password.$viewValue)
        .then(function(data) {
            $ionicLoading.hide();
            loginForm.$setValidity("loginError", true);
            $state.go('menu.home');
        }, function(error) {
            $ionicLoading.hide();
            loginForm.$setValidity("loginError", false);
            $scope.error = error.response;
        });
    };
}]);

angular.module('ifiske.controllers')
.controller('MenuCtrl', [
    '$scope',
    '$state',
    '$ionicPopover',
    'sessionData',
    'Update',
    function($scope, $state, $ionicPopover, sessionData, Update) {

    $scope.sessionData = sessionData;

    $ionicPopover.fromTemplateUrl('components/menu/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.userinfo = function() {
	$scope.popover.hide();
	$state.go('menu.userinfo');
    };
    $scope.logout = function() {
	$scope.popover.hide();
	Update.user_logout();

	$state.go('start.login');
    };
    $scope.login = function() {
	$scope.popover.hide();
	$state.go('start.login');
    };
    $scope.register = function() {
	$scope.popover.hide();
	$state.go('start.register.account_details');
    };

    $scope.update = function() {
        Update.forcedUpdate();
    };

}]);

angular.module('ifiske.controllers')
    .controller('RegisterCtrl', ['$scope', '$state', '$ionicLoading', 'API', function($scope, $state, $ionicLoading, API) {
	
	var username, password, phone;
	
	$scope.accountDetails = function(form) {
	    username = form.username.$viewValue;
	    password = form.password.$viewValue;
	    $state.go('^.userDetails');
	};

	$scope.userDetails = function(form) {
	    $ionicLoading.show();

	    var fullname = form.fullname.$viewValue;
	    var email = form.email.$viewValue;
	    phone = $scope.phone = form.phone.$viewValue;
	    
	    API.user_register(username, fullname, password, email, phone)
		.then(function(data) { 
		    $ionicLoading.hide();
		    $state.go('^.verify');
		}, function(error) {
		    // ToDo: display error
		    $ionicLoading.hide();
		});
	};

	$scope.verify = function(form) {
	    $ionicLoading.show();

	    var vercode = form.vercode;
	    
	    API.user_confirm(username, vercode.$viewValue)
		.then(function(data) {
		    $state.go('start.login');
		    vercode.$setValidity("verified", true);
		    $ionicLoading.hide();

		}, function(error) {
		    vercode.$setValidity("verified", false);
		    $ionicLoading.hide();
		});
	};
    }]);

angular.module('ifiske.controllers')
.controller('TechniqueDetailCtrl', ['$scope', '$stateParams', 'DB', '$ionicSlideBoxDelegate', function($scope, $stateParams, DB, $ionicSlideBoxDelegate) {
    $scope.image_endpoint = 'http://www.ifiske.se';
    $scope.tech = $stateParams.tech;
    $scope.images = [];

    if(!$scope.tech) {
        DB.getTechnique($stateParams.id)
        .then(function(data) {
            $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
                return !/\/$/.test(el);
            });

            $ionicSlideBoxDelegate.update();
            $scope.tech = data;
        });
    } else {
        var data = $scope.tech;
        $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
            return !/\/$/.test(el);
        });

        $ionicSlideBoxDelegate.update();
    }
}]);

angular.module('ifiske.controllers')
.controller('TechniquesCtrl', ['$scope', 'DB', function($scope, DB) {
    DB.getTechniques()
    .then(function(data) {
        console.log(data);
        $scope.techniques = data;
    });
    $scope.image_endpoint = 'http://www.ifiske.se';
    $scope.sortorder = 'so';

}]);

angular.module('ifiske.controllers')
.controller('UserCtrl', ['$scope', 'DB', function($scope, DB) {
    DB.getUserInfo()
    .then(function(user) {
        $scope.user = user;
    });
    DB.getUserNumbers()
    .then(function(numbers) {
        $scope.numbers = numbers;
    });
}]);

angular.module('ifiske.controllers')
.controller('UserCardsCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.pred = '-to';
    $scope.now = Date.now();
    DB.getUserProducts()
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
        console.log(err);
    });
}]);

(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.api', ['ifiske.utils'])
    .provider('API', function APIProvider() {

        this.base_url = 'https://www.ifiske.se/api/v2/api.php';

        this.$get = ['$http', 'sessionData', 'localStorage', '$q', function($http, sessionData, localStorage, $q) {
            var base_url = this.base_url;

            /**
             * # api_call #
             * handles http requests
             * returns a $http object for the requested api call
             */
            var api_call = function(params) {
                return $q(function(fulfill, reject) {
                    $http(
                        {
                            method:'get',
                            url: base_url,
                            params: angular.extend(params, {'key': '0123456789abcdef'}),
                            timeout: 5000,
                            cache: true
                        }
                    )
                    // ToDo: Proper logging
                    .success(function(data) {
                        if(data.status === 'error') {
                            reject(data.message);
                        } else {
                            fulfill(data);
                        }
                    })
                    .error(function(data, status, headers, config, statusText) {
                        if (status === 0) {
                            reject(new Error('Request timeout'));
                        } else {
                            reject(data);
                        }
                    });
                });
            };

            /**
             * # session_api_call #
             * wrapper for api_call - inserts the session token into params
             */
            var session_api_call = function(params) {
                var session = sessionData.token;
                return api_call(angular.extend(params, {s: session}));
            };

            return {
                get_municipalities: function() {
                    return api_call({m: 'get_municipalities'});
                },
                get_counties: function() {
                    return api_call({m: 'get_counties'});
                },
                user_exists: function(username) {
                    return api_call({m: 'user_exists', username: username});
                },
                user_register: function(username, fullname, password, email, phone) {
                    return api_call(
                        { m: 'user_register',
                            username: username,
                            fullname: fullname,
                            password: password,
                            email: email,
                            phone: phone
                        });
                },
                user_confirm: function(username, pin) {
                    return api_call(
                        { m: 'user_confirm',
                            username: username,
                            pin: pin
                        });
                },
                user_info: function() {
                    return session_api_call({m: 'user_info'});
                },
                user_login: function(username, password) {
                    return api_call(
                        { m: 'user_login',
                            username: username,
                            password: password
                        })
                        .then(function(data) {
                            sessionData.setToken(data.data.response);

                            //needed for chaining of promises, should be done some other way perhaps?
                            return data;
                        });
                },
                user_logout: function() {
                    session_api_call({m: 'user_logout'})
                    .then(function(data) {
                        sessionData.deleteToken();
                    });
                },
                user_products: function() {
                    return session_api_call({m: 'user_products'});
                },
                get_fishes: function() {
                    return api_call({m: 'get_fishes'});
                },
                get_techniques: function() {
                    return api_call({m: 'get_techniques'});
                },
                get_baits: function() {
                    return api_call({m: 'get_baits'});
                },
                get_organizations: function(orgid) {
                    return api_call(
                        { m: 'get_organizations',
                            orgid: orgid
                        });
                },
                get_org_modified: function(orgid) {
                    return api_call(
                        { m: 'get_org_modified',
                            orgid: orgid
                        });
                },
                get_areas: function(areaid) {
                    return api_call(
                        { m: 'get_areas',
                            areaid: areaid
                        });
                },
                get_areas_modified: function(areaid) {
                    return api_call(
                        { m: 'get_areas_modified',
                            areaid: areaid
                        });
                },
                get_products: function(areaid) {
                    return api_call(
                        { m: 'get_products',
                            areaid: areaid
                        });
                },
                get_rules: function(ruleid) {
                    return api_call(
                        { m: 'get_rules',
                            ruleid: ruleid
                        });
                },
                get_photos: function(orgid, areaid) {
                    return api_call(
                        { m: 'get_photos',
                            orgid: orgid,
                            areaid: areaid
                        });
                },
                get_map_pois: function(orgid) {
                    return api_call(
                        { m: 'get_map_pois',
                            orgid: orgid
                        });
                },
                get_map_poi_types : function() {
                    return api_call({m: 'get_map_poi_types'});
                },
                get_map_polygons: function(orgid) {
                    return api_call(
                        { m: 'get_map_polygons',
                            orgid: orgid
                        });
                },
                user_get_favorites: function() {
                    return session_api_call({m: 'user_get_favorites'});
                },
                get_terms_of_service: function() {
                    return api_call({m: 'get_terms_of_service'});
                },
                get_contact_info: function() {
                    return api_call({m: 'get_contact_info'});
                },
                get_engine_policies: function() {
                    return api_call({m: 'get_engine_policies'});
                },
                get_sms_terms: function() {
                    return api_call({m: 'get_sms_terms'});
                }
            };
        }];
    });
})(window.angular);

(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.db', [])
    .provider('DB', function DBProvider() {

        this.$get = [ '$cordovaSQLite', 'API', '$q', function($cordovaSQLite, API, $q) {


            var db;
            if (window.sqlitePlugin) {
                db = $cordovaSQLite.openDB('fiskebasen.db');
            } else if (window.openDatabase) {
                db = window.openDatabase('fiskebasen.db', '1.0', 'fiskebasen', 10*1024*1024);
            } else {
                console.log('Not supported on this device, sorry');
                return undefined;
            }


            var tableDef = {
                'Area': [
                    ['ID',    'int'],
                    ['orgid', 'int'],
                    ['t',     'text'],
                    ['kw',    'text'],
                    ['note',  'text'],
                    ['c1',    'int'],
                    ['c2',    'int'],
                    ['c3',    'int'],
                    ['m1',    'int'],
                    ['m2',    'int'],
                    ['m3',    'int'],
                    ['lat',   'real'],
                    ['lng',   'real'],
                    ['zoom',  'text'],
                    ['pnt',   'int'],
                    ['car',   'int'],
                    ['eng',   'int'],
                    ['hcp',   'int'],
                    ['map',   'text'],
                    ['wsc',   'int'],
                    ['mod',   'int'],
                    ['d',     'text']
                ],
                'Area_Fish': [
                    ['ID', 'text'],
                    ['aid', 'int'],
                    ['fid', 'int'],
                    ['amount', 'int'],
                    ['comment', 'text']
                ],
                'Product': [
                    ['ID',     'int'],
                    ['t',      'text'],
                    ['t2',     'text'],
                    ['no',     'text'],
                    ['im',     'text'],
                    ['pf',     'text'],
                    ['ai',     'int'],
                    ['ri',     'int'],
                    ['ch',     'int'],
                    ['price',  'int'],
                    ['mod',    'int'],
                    ['so',     'int'],
                    ['hl',     'text']
                ],
                'County': [
                    ['ID',  'int'],
                    ['s',   'text'],
                    ['t',   'text'],
                    ['d',   'text']
                ],
                'Municipality': [
                    ['ID',    'int'],
                    ['cID',   'int'],
                    ['name',  'text']
                ],
                'Fish': [
                    ['ID',    'int'],
                    ['t',     'text'],
                    ['d',     'text'],
                    ['mod',   'int'],
                    ['so',    'int'],
                    ['max',   'int'],
                    ['icon',  'text'],
                    ['img',   'text'],
                    ['in',    'text'],
                    ['geo',   'text'],
                    ['size',  'text'],
                    ['lat',   'text'],
                    ['rec',   'text']
                ],
                'Rule': [
                    ['ID',   'int'],
                    ['ver',  'int'],
                    ['d',    'text'],
                    ['t',    'text']
                ],
                'User_Product': [
                    ['ID',        'int'],
                    ['at',        'int'],
                    ['code',      'int'],
                    ['fr',        'int'],
                    ['fullname',  'text'],
                    ['ot',        'text'],
                    ['ref1',      'int'],
                    ['ref2',      'int'],
                    ['t',         'text'],
                    ['to',        'int']
                ],
                'User_Info': [
                    ['ID',        'int'],
                    ['username',  'text'],
                    ['loggedin',  'text'],
                    ['IP1',       'text'],
                    ['IP2',       'text'],
                    ['name',      'text'],
                    ['email',     'text'],
                    ['created',   'text']
                ],
                'User_Number': [
                    ['number', 'text']
                ],
                'Technique': [
                    ['ID',       'int'],
                    ['t',        'text'],
                    ['d',        'text'],
                    ['so',       'int'],
                    ['de',       'text'],
                    ['da',       'text'],
                    ['icon',     'text'],
                    ['img1',     'text'],
                    ['img2',     'text'],
                    ['img3',     'text'],
                    ['youtube',  'text']
                ],
                'Organization': [
                    ['ID',     'int'],
                    ['t',      'text'],
                    ['d',      'text'],
                    ['cp',     'text'],
                    ['url',    'text'],
                    ['co',     'int'],
                    ['mod',    'int'],
                    ['vat',    'int'],
                    ['dp',     'int'],
                    ['fva',    'int'],
                    ['org',    'int'],
                    ['ml',     'int']
                ]
            };

            var createObject = function(data) {
                var retval = [];
                for(var i = 0; i < data.rows.length; ++i) {
                    retval.push(data.rows.item(i));
                }
                return retval;
            };



            return {
                populateTable: function(table, data) {
                    return $q(function (fulfill, reject) {
                        db.transaction(function(tx) {
                            tx.executeSql('DELETE FROM ' + table + ';');

                            for (var id in data) {
                                var singleData = data[id];
                                var insertData = [];
                                for (var i = 0; i < tableDef[table].length; ++i) {
                                    insertData.push(singleData[tableDef[table][i][0]]);
                                }
                                var query = [
                                    'INSERT INTO',
                                    table,
                                    'VALUES(?',
                                    ',?'.repeat(insertData.length-1),
                                    ')'].join(' ');

                                    tx.executeSql(query, insertData);
                            }
                        },
                        reject,
                        fulfill);
                    });

                },

                cleanTable: function(table) {
                    return $q(function (fulfill, reject) {
                        db.transaction(function(tx) {
                            tx.executeSql('DELETE FROM ' + table + ';');
                        },
                        reject,
                        fulfill);
                    });
                },

                /**
                 * Drops all tables in the database
                 * @method clean
                 */
                clean: function() {
                    return $q(function (fulfill, reject) {
                        db.transaction(
                            function(tx) {
                                for(var table in tableDef){
                                    tx.executeSql('DROP TABLE IF EXISTS ' + table + ';');
                                }
                            },
                            reject,
                            fulfill
                        );
                    })
                    .then(function() {
                        console.log('Removed all tables');
                    });
                },

                /**
                 * Initialies the tables in the database
                 * @method init
                 */
                init: function(){
                    return $q(function(fulfill, reject) {
                        db.transaction( function (tx) {
                            for(var table in tableDef) {
                                var query = [
                                    'CREATE TABLE IF NOT EXISTS',
                                    table,
                                    '(',
                                    '"' + tableDef[table].join('___"').split(',').join('" ').split('___').join(', '),
                                    ', PRIMARY KEY(',
                                    '"' + tableDef[table][0][0] + '"',
                                    '));'
                                ].join(' ');
                                tx.executeSql(query);
                            }
                        },
                        reject,
                        fulfill);
                    });
                },



                /**
                 * Gets information about an area
                 * @method getArea
                 * @param {Integer} id
                 */
                getArea: function(id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area',
                            'WHERE id = ?'
                        ].join(' '), [id])
                        .then( function (area) {
                            var object = createObject(area)[0];
                            API.get_photos(object.orgid)
                            .then(function(images) {
                                object.images = images.data.response;
                                fulfill(object);
                            }, function(err) {
                                fulfill(object);
                            });
                        });
                    });
                },

                getAreaFishes: function(aid) {
                    return $q( function (fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area_Fish',
                            'JOIN Fish ON Area_Fish.fid = Fish.ID',
                            'WHERE Area_Fish.aid = ?'
                        ].join(' '), [aid])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                /**
                 * Searches the database using a query
                 *
                 * The query is matched to a name and/or keyword
                 * @method search
                 * @param {String} searchstring
                 */
                search: function(searchstring, county_id) {
                    return $q( function (fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area',
                            'WHERE t LIKE ?',
                            (county_id ? 'AND c1 = ?':''),
                            'ORDER BY t'
                        ].join(' '),
                        county_id ? ['%' + searchstring + '%', county_id]:['%' + searchstring + '%'])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                /**
                 * Gets information about a product
                 * @method getProduct
                 * @param {Integer} product_id
                 */
                getProduct: function(product_id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT *',
                            'FROM Product',
                            'WHERE ID = ?'
                        ].join(' '),
                        [product_id])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                /**
                 * Gets all products from an area
                 * @method getProductsByArea
                 * @param {Integer} area_id
                 */
                getProductsByArea: function(area_id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT Product.*,',
                            'Rule.t as rule_t,',
                            'Rule.ver as rule_ver,',
                            'Rule.d as rule_d',
                            'FROM Product',
                            'JOIN Rule ON Rule.ID = Product.ri',
                            'WHERE ai = ?',
                            'ORDER BY so'
                        ].join(' '),
                        [area_id])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                getCounties: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT County.*',
                            'FROM County',
                            'JOIN Area ON Area.c1 = County.ID',
                            'ORDER BY County.t'
                        ].join(' '))
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                getUserProducts: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM User_Product'
                        ].join(' '))
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                getFishes: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM Fish'
                        ].join(' '))
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                getFish: function(id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM Fish',
                            'WHERE id = ?'
                        ].join(' '), [id])
                        .then(function(data) {
                            fulfill(createObject(data)[0]);
                        }, reject);
                    });
                },

                getTechniques: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM Technique'
                        ].join(' '))
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },
                getTechnique: function(id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM Technique',
                            'WHERE ID = ?'
                        ].join(' '), [id])
                        .then(function(data) {
                            fulfill(createObject(data)[0]);
                        }, reject);
                    });
                },
                getOrganization: function(id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM Organization',
                            'WHERE ID = ?'
                        ].join(' '), [id])
                        .then(function(data) {
                            fulfill(createObject(data)[0]);
                        }, reject);
                    });
                },
                getUserInfo: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM User_Info'
                        ].join(' '))
                        .then( function (user) {
                            fulfill(createObject(user)[0]);
                        }, reject);
                    });
                },
                getUserNumbers: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM User_Number'
                        ].join(' '))
                        .then( function (data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },


            };
        }];
    });
})(window.angular);

angular.module('ifiske.filters', [])
.filter('nobrs', function() {
    return function(input) {
        return input.replace(/(<br>\s*)+/g, '<br>');
    };
});

(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.update', ['ifiske.api', 'ifiske.db', 'ifiske.utils'])
    .provider('Update', function UpdateProvider() {


        this.$get = [
            'API',
            'DB',
            'localStorage',
            '$q',
            '$ionicLoading',
            'sessionData',
            function(API, DB, localStorage, $q, $ionicLoading, sessionData) {

                var LAST_UPDATE = 'last_update';

                var populate = function() {
                    return $q.all([
                        API.get_areas()
                        .then(function(data) {
                            var fishArr = [];
                            for(var key in data.data.response) {
                                var fishes = data.data.response[key].fish;
                                for(var fishKey in fishes) {
                                    fishArr.push({
                                        'ID': key+'_'+fishKey,
                                        fid: fishKey,
                                        aid: key,
                                        amount: fishes[fishKey][0],
                                        comment: fishes[fishKey][1]
                                    });
                                }
                            }
                            return $q.all([
                                DB.populateTable('Area', data.data.response),
                                DB.populateTable('Area_Fish', fishArr)
                            ])
                            .then(function() {
                                console.log('Populated Area');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_products()
                        .then(function(data) {
                            return DB.populateTable('Product', data.data.response)
                            .then(function() {
                                console.log('Populated Product');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_counties()
                        .then(function(data) {
                            return DB.populateTable('County', data.data.response)
                            .then(function() {
                                console.log('Populated County');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_municipalities()
                        .then(function(data) {
                            return DB.populateTable('Municipality', data.data.response)
                            .then(function() {
                                console.log('Populated Municipality');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_fishes()
                        .then(function(data) {
                            return DB.populateTable('Fish', data.data.response)
                            .then(function() {
                                console.log('Populated Fish');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_rules()
                        .then(function(data) {
                            return DB.populateTable('Rule', data.data.response)
                            .then(function() {
                                console.log('Populated Rule');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_techniques()
                        .then(function(data) {
                            return DB.populateTable('Technique', data.data.response)
                            .then(function() {
                                console.log('Populated Technique');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_organizations()
                        .then(function(data) {
                            return DB.populateTable('Organization', data.data.response)
                            .then(function() {
                                console.log('Populated Organization');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        })
                    ]);
                };

                var populateUser = function() {
                    return $q.all([
                        API.user_products()
                        .then(function(data) {
                            return DB.populateTable('User_Product', data.data.response)
                            .then(function() {
                                console.log('Populated User_Product');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.user_info()
                        .then(function(data) {
                            var numbers = data.data.response.numbers;
                            var numArr = [];
                            for(var i = 0; i < numbers.length; ++i) {
                                numArr.push({'number': numbers[i]});
                            }
                            return $q.all([
                                DB.populateTable('User_Info', [data.data.response])
                                .then(function() {
                                    console.log('Populated User_Info');
                                }, function(err) {
                                    console.log(data.data.response);
                                    console.log(err);
                                    return $q.reject(err);
                                }),
                                DB.populateTable('User_Number', numArr)
                                .then(function() {
                                    console.log('Populated User_Numbers');
                                }, function(err) {
                                    console.log(err);
                                    return $q.reject(err);
                                }),
                            ]);
                        })
                    ]);
                };

                var cleanUser = function() {
                    return $q.all([
                        DB.cleanTable('User_Product'),
                        DB.cleanTable('User_Number'),
                        DB.cleanTable('User_Info')
                    ])
                    .then(function() {
                        console.log('Removed user info from database');
                    }, function(err) {
                        console.log('Could not remove user data from database!', err);
                    });
                };


                var updateFunc = function(forced) {
                    $ionicLoading.show();

                    var currentTime = Date.now();

                    var lastUpdate = 0;
                    if(!forced) {
                        lastUpdate = localStorage.get(LAST_UPDATE);
                    }

                    var aWeek = 1000*3600*24*7;
                    if(currentTime - lastUpdate > aWeek) {
                        DB.init()
                        .then(function() {
                            console.log('Initialized DB system');
                            if(sessionData.token) {
                                return $q.all([
                                    populateUser(),
                                    populate()
                                ]);
                            } else {
                                return populate();
                            }
                        })

                        .then(function(){
                            console.log('Populated all the things');
                            localStorage.set(LAST_UPDATE, currentTime);
                            $ionicLoading.hide();
                        }, function(err) {
                            if(err.error_code === 7) {
                                // Authentication failure
                                // TODO: Show to user
                                cleanUser();
                                API.user_logout();
                                $ionicLoading.hide();
                            } else {
                                console.log('Got an error, will try to recreate all tables: ', err);

                                return DB.clean()
                                .then(function(){
                                    return DB.init();
                                })

                                .then(function(){
                                    return populate();
                                })

                                .then(function(){
                                    console.log('Populated all the things');
                                    localStorage.set(LAST_UPDATE, currentTime);
                                    $ionicLoading.hide();
                                }, function(err) {
                                    console.log('Still error, handle it!', err);
                                    $ionicLoading.hide();
                                });
                            }
                        });
                        API.get_terms_of_service()
                        .then(function(data) {
                            localStorage.set('tos',data.data.response);
                        });
                        API.get_sms_terms()
                        .then(function(terms) {
                            localStorage.set('sms_terms', terms.data.response);
                        });
                        API.get_contact_info()
                        .then(function(data) {
                            localStorage.set('contactInfo', data.data.response);
                        });

                    } else if(sessionData.token) {
                        DB.init()
                        .then(function() {
                            console.log('Initialized DB system');
                            if(sessionData.token) {
                                populateUser()
                                .then(function() {
                                    $ionicLoading.hide();
                                }, function(err) {
                                    $ionicLoading.hide();
                                });
                            }
                            $ionicLoading.hide();
                        });
                    } else {
                        console.log('no_update');
                        $ionicLoading.hide();
                    }
                };

                return {
                    update: function() {
                        updateFunc();
                    },

                    forcedUpdate: function() {
                        updateFunc(true);
                    },

                    user_logout: function() {
                        cleanUser();
                        API.user_logout();
                    },
                    user_login: function(username, password) {
                        return API.user_login(username, password)
                        .then(function() {
                            updateFunc();
                        });
                    },
                    last_update: function() {
                        return localStorage.get(LAST_UPDATE);
                    }
                };
            }];
    });
})(window.angular);

angular.module('ifiske.utils', [])

.factory('localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage.setItem(key, value);
        },
        get: function(key) {
            return $window.localStorage.getItem(key);
        },
        remove: function(key) {
            $window.localStorage.removeItem(key);
        }
    };
}])
.service('sessionData', ['localStorage', function(localStorage) {
    this.token = localStorage.get('session');

    this.setToken = function(t) {
        localStorage.set('session', t);
        this.token = t;
        console.log('token set');
    };
    this.deleteToken = function() {
        localStorage.remove('session');
        this.token = null;
        console.log('token unset');
    };
}]);

angular.module('ngCordovaSms', [])
.directive('ngCordovaSms', ['$cordovaSms', '$ionicPopup', function($cordovaSms, $ionicPopup) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                e.preventDefault();
                $ionicPopup.prompt({
                    title: 'Skriv in ditt namn',
                    inputType: 'text'
                }).then(function(name) {
                    var message = 'FISKA ' + attrs.ngCordovaSms + ' ' + name;
                    $cordovaSms.send('72456', message, 'INTENT', function() {
                        console.log('succuess');
                    }, function(err) {
                        console.log(err);
                    });
                });
            });
        }
    };
}]);

angular.module('ifiske.directives')
    .directive('ifiskeInput', function() {
	return {
	    restrict: 'E',
	    transclude: true,

	    scope: {
		name: '@',
		id: '@',
		label: '@',
		placeholder: '@',
		type: '@',
		ngPattern: '@',
		ngModel: '=?'

	    },
	    templateUrl: 'directives/input_field/ifiske_input.html',
	    controller: function($scope) {
		$scope.id = $scope.id || $scope.name;
		$scope.type = $scope.type || 'text';
	    }
	}
    })

angular.module('systemBrowser', [])
.directive('systemBrowser', ['$cordovaInAppBrowser', function($cordovaInAppBrowser) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                $cordovaInAppBrowser.open(el[0].href, '_system');
                e.preventDefault();
            });
        }
    };
}])
.directive('globalSystemBrowser', ['$cordovaInAppBrowser', function($cordovaInAppBrowser) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                if (e.target.href && e.target.host !== window.location.host) {
                    $cordovaInAppBrowser.open(e.target.href, '_system');
                    e.preventDefault();
                }
            });
        }
    };
}]);

/*angular.module('treeTabs', ['ionic'])
    .directive('ionTabs', ['$rootScope','$state','$ionicHistory','$ionicViewSwitcher', function($rootScope, $state, $ionicHistory, $ionicViewSwitcher) {
	function getTabRootState(state) {
	    var isRootState;

	    if (state.parent.self.abstract) {
		isRootState = state.self.name;
	    } else {
		isRootState = false;
	    }

	    return  isRootState || getTabRootState(state.parent);
	}

	function isTabRootState(state) {
	    return state.self.name === getTabRootState(state);
	}

	return {
	    restrict: 'EA',
	    require: 'ionTabs',
	    link: function(scope, element, attr, ctrl) {
		console.log('s: ',scope);
		console.log('e: ',element);
		console.log('a: ',attr);
		console.log('c: ',ctrl);
		var selectTab = ctrl.select;
		ctrl.select = function(tab, shouldEmitEvent) {
		    var selectedTab = ctrl.selectedTab();

		    if (arguments.length === 1) {
			shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
		    }

		    if (selectedTab && selectedTab.$historyId == tab.$historyId && !isTabRootState($state.$current)) {
			if (shouldEmitEvent) {
			    $ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: false
			    });
			    $ionicViewSwitcher.nextDirection('back');
			    $state.go(getTabRootState($state.$current));
			}
		    } else if (selectedTab && selectedTab.$historyId == tab.$historyId && isTabRootState($state.$current)) {
			return;
		    } else {
			selectTab.apply(this, arguments);
		    }
		};
	    }
	};
    }]);
*/

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0X2NvbnRyb2xsZXIuanMiLCJhcmVhMi9hcmVhMl9jb250cm9sbGVyLmpzIiwiYXJlYV9saXN0L2FyZWFfbGlzdF9jb250cm9sbGVyLmpzIiwiY29udGFjdC9jb250YWN0X2NvbnRyb2xsZXIuanMiLCJjb3VudGllcy9jb3VudGllc19jb250cm9sbGVyLmpzIiwiZmlzaF9kZXRhaWwvZmlzaF9kZXRhaWxfY29udHJvbGxlci5qcyIsImZpc2hlcy9maXNoZXNfY29udHJvbGxlci5qcyIsImhvbWUvaG9tZV9jb250cm9sbGVyLmpzIiwibGVnYWwvbGVnYWxfY29udHJvbGxlci5qcyIsImxvZ2luL2xvZ2luX2NvbnRyb2xsZXIuanMiLCJtZW51L21lbnVfY29udHJvbGxlci5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyX2NvbnRyb2xsZXIuanMiLCJ0ZWNobmlxdWVfZGV0YWlsL3RlY2huaXF1ZV9kZXRhaWxfY29udHJvbGxlci5qcyIsInRlY2huaXF1ZXMvdGVjaG5pcXVlc19jb250cm9sbGVyLmpzIiwidXNlci91c2VyX2NvbnRyb2xsZXIuanMiLCJ1c2VyX2NhcmRzL3VzZXJfY2FyZHNfY29udHJvbGxlci5qcyIsImFwaS5qcyIsImRiLmpzIiwiZmlsdGVyLmpzIiwidXBkYXRlLmpzIiwidXRpbHMuanMiLCJpZmlza2Vfc21zL2lmaXNrZV9zbXMuanMiLCJpbnB1dF9maWVsZC9pZmlza2VfaW5wdXQuanMiLCJzeXN0ZW1fYnJvd3Nlci9zeXN0ZW1fYnJvd3Nlci5qcyIsInRyZWVfdGFicy90cmVlX3RhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnaWZpc2tlJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ2lmaXNrZS5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcblxuYW5ndWxhci5tb2R1bGUoJ2lmaXNrZScsIFtcbiAgICAnaW9uaWMnLFxuICAgICdpZmlza2UuY29udHJvbGxlcnMnLFxuICAgICdpZmlza2UuZGlyZWN0aXZlcycsXG4gICAgJ2lmaXNrZS5hcGknLFxuICAgICdpZmlza2UuZGInLFxuICAgICdpZmlza2UudXRpbHMnLFxuICAgICdpZmlza2UudXBkYXRlJyxcbiAgICAnaWZpc2tlLmZpbHRlcnMnLFxuICAgICdpb25pYy5pb24uaGVhZGVyU2hyaW5rJyxcbiAgICAnbmdDb3Jkb3ZhJyxcbiAgICAnc3lzdGVtQnJvd3NlcicsXG4gICAgJ25nQ29yZG92YVNtcycsXG4gICAgJ25nTWVzc2FnZXMnLFxuICAgICdJbWdDYWNoZSdcbl0pXG4uY29uc3RhbnQoJyRpb25pY0xvYWRpbmdDb25maWcnLCB7XG4gICAgdGVtcGxhdGU6ICc8aSBjbGFzcz1cImljb24gaW9uLWxvYWRpbmctYlwiPjwvaT4nXG4gICAgLy8gaGlkZU9uU3RhdGVDaGFuZ2U6IHRydWVcbn0pXG4ucnVuKFsnJGlvbmljUGxhdGZvcm0nLCAnVXBkYXRlJywgJ0ltZ0NhY2hlJywgZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0sIFVwZGF0ZSwgSW1nQ2FjaGUpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICAgIGlmKHdpbmRvdy5pb25pYyAmJiB3aW5kb3cuaW9uaWMuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5pb25pYy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgSW1nQ2FjaGUuJGluaXQoKTtcbiAgICAgICAgVXBkYXRlLnVwZGF0ZSgpO1xuICAgIH0pO1xufV0pXG5cbi5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGlvbmljQ29uZmlnUHJvdmlkZXInLCAnSW1nQ2FjaGVQcm92aWRlcicsIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRpb25pY0NvbmZpZ1Byb3ZpZGVyLCBJbWdDYWNoZVByb3ZpZGVyKSB7XG5cbiAgICBJbWdDYWNoZVByb3ZpZGVyLnNldE9wdGlvbnMoe1xuICAgICAgICBkZWJ1ZzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGVudENhY2hlOiB0cnVlXG4gICAgfSk7XG4gICAgSW1nQ2FjaGVQcm92aWRlci5tYW51YWxJbml0ID0gdHJ1ZTtcblxuXG5cbiAgICAvLyBDYWNoZSB2aWV3cyBpbiB0aGUgZm9yd2FyZCBzdGFja1xuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnZpZXdzLmZvcndhcmRDYWNoZSh0cnVlKTtcblxuICAgIC8vIENsZWFyIGJhY2sgYnV0dG9uIGRlZmF1bHQgdGV4dFxuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xuXG4gICAgLy8gVGFicyBwb3NpdGlvblxuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnRhYnMucG9zaXRpb24oJ2JvdHRvbScpO1xuXG4gICAgLyoqXG4gICAgICogSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyLiBMZWFybiBtb3JlIGhlcmU6XG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gICAgICovXG5cbiAgICB2YXIgZGVmYXVsdFVybCA9ICcvc3RhcnQvbG9naW4nO1xuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Nlc3Npb24nKSkge1xuICAgICAgICBkZWZhdWx0VXJsID0gJy9tZW51L2hvbWUnO1xuICAgIH1cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKGRlZmF1bHRVcmwpO1xuXG5cblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLy8gQWJzdHJhY3QgcHJlLW1lbnUgc3RhdGUuIE5lZWRlZCBmb3IgbmF2aWdhdGlvbiBiZXR3ZWVuIGxvZ2luIGFuZCByZWdpc3RlciB2aWV3cy5cbiAgICAuc3RhdGUoJ3N0YXJ0Jywge1xuICAgICAgICB1cmw6ICcvc3RhcnQnLFxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3N0YXJ0L3N0YXJ0Lmh0bWwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LmxvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LnJlZ2lzdGVyJywge1xuICAgICAgICB1cmw6ICcvcmVnaXN0ZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVnaXN0ZXIvcmVnaXN0ZXIuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LnJlZ2lzdGVyLmFjY291bnREZXRhaWxzJywge1xuICAgICAgICB1cmw6ICcvYWNjb3VudF9kZXRhaWxzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlZ2lzdGVyL3JlZ2lzdGVyX2FjY291bnRfZGV0YWlscy5odG1sJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzdGFydC5yZWdpc3Rlci51c2VyRGV0YWlscycsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJfZGV0YWlscycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZWdpc3Rlci9yZWdpc3Rlcl91c2VyX2RldGFpbHMuaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc3RhcnQucmVnaXN0ZXIudmVyaWZ5Jywge1xuICAgICAgICB1cmw6ICcvdmVyaWZ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlZ2lzdGVyL3JlZ2lzdGVyX3ZlcmlmeS5odG1sJ1xuICAgIH0pXG5cbiAgICAvLyBBYnN0cmFjdCBtZW51IHN0YXRlLiBcIlJvb3RcIiBzdGF0ZSBvbmNlIHdlJ3JlIHBhc3QgdGhlIGxvZ2luIHN0YXRlLlxuICAgIC5zdGF0ZSgnbWVudScsIHtcbiAgICAgICAgdXJsOiAnL21lbnUnLFxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21lbnUvbWVudS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ01lbnVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmhvbWUnLCB7XG4gICAgICAgIHVybDogJy9ob21lJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmluZm8nLCB7XG4gICAgICAgIHVybDogJy9pbmZvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2luZm8vaW5mby5odG1sJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmNvbnRhY3QnLCB7XG4gICAgICAgIHVybDogJy9jb250YWN0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmxlZ2FsJywge1xuICAgICAgICB1cmw6ICcvbGVnYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbGVnYWwvbGVnYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMZWdhbEN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuYWJvdXQnLCB7XG4gICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9hYm91dC9hYm91dC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS51c2VyaW5mbycsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJpbmZvJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDdHJsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3VzZXIvdXNlci5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5jb3VudGllcycsIHtcbiAgICAgICAgdXJsOiAnL2NvdW50aWVzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2NvdW50aWVzL2NvdW50aWVzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ291bnRpZXNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmFyZWFzJywge1xuICAgICAgICB1cmw6ICcvYXJlYXMnLFxuICAgICAgICBwYXJhbXM6IHsnaWQnOiBmYWxzZSwgJ2NvdW50eSc6IGZhbHNlLCAnc2VhcmNoJzogJyd9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYV9saXN0L2FyZWFfbGlzdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0FyZWFzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5jYXJkcycsIHtcbiAgICAgICAgdXJsOiAnL2NhcmRzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3VzZXJfY2FyZHMvdXNlcl9jYXJkcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDYXJkc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuZmF2b3JpdGVzJywge1xuICAgICAgICB1cmw6ICcvZmF2b3JpdGVzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2Zhdm9yaXRlcy9mYXZvcml0ZXMuaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5maXNoZXMnLCB7XG4gICAgICAgIHVybDogJy9maXNoZXMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvZmlzaGVzL2Zpc2hlcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Zpc2hlc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuZmlzaGRldGFpbCcsIHtcbiAgICAgICAgdXJsOiAnL2Zpc2hkZXRhaWwvOmlkJyxcbiAgICAgICAgcGFyYW1zOiB7J2lkJzogZmFsc2UsICdmaXNoJzogZmFsc2V9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvZmlzaF9kZXRhaWwvZmlzaF9kZXRhaWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGaXNoRGV0YWlsQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS50ZWNobmlxdWVzJywge1xuICAgICAgICB1cmw6ICcvdGVjaG5pcXVlcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy90ZWNobmlxdWVzL3RlY2huaXF1ZXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUZWNobmlxdWVzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS50ZWNobmlxdWVkZXRhaWwnLCB7XG4gICAgICAgIHVybDogJy90ZWNobmlxdWVkZXRhaWwvOmlkJyxcbiAgICAgICAgcGFyYW1zOiB7J2lkJzogZmFsc2UsICd0ZWNoJzogZmFsc2V9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvdGVjaG5pcXVlX2RldGFpbC90ZWNobmlxdWVfZGV0YWlsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVGVjaG5pcXVlRGV0YWlsQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5yZXBvcnQnLCB7XG4gICAgICAgIHVybDogJy9yZXBvcnQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0L3JlcG9ydC5odG1sJ1xuICAgIH0pXG5cbiAgICAuc3RhdGUoJ2FyZWFkZXRhaWwyJywge1xuICAgICAgICBhYnN0cmFjdDp0cnVlLFxuICAgICAgICB1cmw6ICcvYXJlYWRldGFpbC86aWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYTIvYXJlYS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0FyZWFDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdhcmVhZGV0YWlsMi5pbmZvJywge1xuICAgICAgICB1cmw6ICcvaW5mbycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaW5mbyc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYS9hcmVhLmh0bWwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXJlYWRldGFpbDIuZmlzaGluZm8nLCB7XG4gICAgICAgIHVybDogJy9maXNoaW5mbycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnZmlzaGluZm8nOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2FyZWFfZmlzaC9hcmVhX2Zpc2guaHRtbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcmVhZGV0YWlsMi5jYXJkcycsIHtcbiAgICAgICAgdXJsOiAnL2NhcmRzJyxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjYXJkcyc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYV9jYXJkcy9hcmVhX2NhcmRzLmh0bWwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdpZmlza2UuZGlyZWN0aXZlcycsIFtdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdBYm91dEN0cmwnLCBbJyRzY29wZScsJyRjb3Jkb3ZhQXBwVmVyc2lvbicsICckaW9uaWNQbGF0Zm9ybScsICdVcGRhdGUnLCBmdW5jdGlvbigkc2NvcGUsICRjb3Jkb3ZhQXBwVmVyc2lvbiwgJGlvbmljUGxhdGZvcm0sIFVwZGF0ZSkge1xuXHQkc2NvcGUudmVyc2lvbiA9ICRzY29wZS5kYkRhdGUgPSAnT2tcXHUwMEU0bnQnO1xuICAgICRzY29wZS5kYkRhdGUgPSBVcGRhdGUubGFzdF91cGRhdGUoKTtcblxuXHQkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcblx0ICAgIGlmICh3aW5kb3cuY29yZG92YSkge1xuXHRcdCRjb3Jkb3ZhQXBwVmVyc2lvbi5nZXRBcHBWZXJzaW9uKCkudGhlbihmdW5jdGlvbih2ZXJzaW9uKSB7XG5cdFx0ICAgIGNvbnNvbGUubG9nKHZlcnNpb24pO1xuXHRcdCAgICAkc2NvcGUudmVyc2lvbiA9IHZlcnNpb247XG5cdFx0fSk7XG5cdCAgICB9XG5cdH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignQXJlYUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRpb25pY0hpc3RvcnknLFxuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJGlvbmljVmlld1N3aXRjaGVyJyxcbiAgICAnJHN0YXRlUGFyYW1zJyxcbiAgICAnREInLFxuICAgICckaW9uaWNTbGlkZUJveERlbGVnYXRlJyxcbiAgICAnJGlvbmljTW9kYWwnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGlvbmljSGlzdG9yeSwgbG9jYWxTdG9yYWdlLCAkcm9vdFNjb3BlLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZVBhcmFtcywgREIsICRpb25pY1NsaWRlQm94RGVsZWdhdGUsICRpb25pY01vZGFsKSB7XG5cbiAgICAgICAgJHNjb3BlLnRhYnNCYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCB2aWV3IGlzIGF0IHRoZSB0b3Agb2YgaXRzIGhpc3Rvcnkgc3RhY2tcbiAgICAgICAgICAgIGlmKCEkaW9uaWNIaXN0b3J5LnZpZXdIaXN0b3J5KCkuY3VycmVudFZpZXcuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBTd2l0Y2ggdG8gdGhlIGhvbWUgaGlzdG9yeSBzdGFja1xuICAgICAgICAgICAgICAgICAqIFNlZSAkaW9uaWNIaXN0b3J5IHNvdXJjZSBmb3IgdGhlIGV2ZW4gaGFuZGxlciB1c2VkXG4gICAgICAgICAgICAgICAgICogU2VlIGhvbWVfY29udHJvbGxlci5qcyBmb3IgdGhlIGhpc3RvcnlJZCB1c2VkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJyRpb25pY0hpc3RvcnkuY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICBoaXN0b3J5SWQ6IGxvY2FsU3RvcmFnZS5nZXQoJ2hvbWVIaXN0b3J5SWQnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IGJhY2sgYWN0aW9uXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kaW9uaWNHb0JhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaW1hZ2VfZW5kcG9pbnQgPSAnaHR0cDovL3d3dy5pZmlza2Uuc2UnO1xuXG4gICAgICAgIC8vIEFyZWFpbmZvXG4gICAgICAgIERCLmdldEFyZWEoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihhcmVhKSB7XG4gICAgICAgICAgICAkc2NvcGUuaW1hZ2VzID0gYXJlYS5pbWFnZXM7XG5cbiAgICAgICAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XG4gICAgICAgICAgICAkc2NvcGUuYXJlYSA9IGFyZWE7XG5cbiAgICAgICAgICAgIERCLmdldE9yZ2FuaXphdGlvbihhcmVhLm9yZ2lkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm9yZyA9IG9yZztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIERCLmdldEFyZWFGaXNoZXMoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihmaXNoZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpc2hlcyk7XG4gICAgICAgICAgICAkc2NvcGUuZmlzaGVzID0gZmlzaGVzO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBEQi5nZXRQcm9kdWN0c0J5QXJlYSgkc3RhdGVQYXJhbXMuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2R1Y3RzKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBwcm9kdWN0cztcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBcmVhIGZpc2hlc1xuICAgICAgICAkc2NvcGUuc29ydG9yZGVyID0gJy1hbW91bnQnO1xuXG4gICAgICAgIC8vQXJlYV9DYXJkc1xuICAgICAgICAkc2NvcGUuc21zdGVybXMgPSBsb2NhbFN0b3JhZ2UuZ2V0KCdzbXNfdGVybXMnKTtcbiAgICAgICAgJHNjb3BlLnByZWRpY2F0ZSA9IFwic29cIjtcblxuXG4gICAgICAgIC8vU01TLW1vZGFsXG4gICAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgnY29tcG9uZW50cy9hcmVhX2NhcmRzL21vZGFsLmh0bWwnLCB7XG4gICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgICAgICRzY29wZS5zbXNfbW9kYWwgPSBtb2RhbDtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgICAgICAkc2NvcGUuc21zX21vZGFsLnNob3coKTtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdDtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5zbXNfbW9kYWwuaGlkZSgpO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuc2hvd1Rlcm1zID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd2luZ3Rlcm1zID0gISRzY29wZS5zaG93aW5ndGVybXM7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5zaG93aW5ndGVybXMgPSBmYWxzZTtcblxuICAgICAgICAvL1J1bGVzIG1vZGFsXG4gICAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgnY29tcG9uZW50cy9hcmVhX2NhcmRzL3J1bGVzX21vZGFsLmh0bWwnLCB7XG4gICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgICAgICRzY29wZS5ydWxlc19tb2RhbCA9IG1vZGFsO1xuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLm9wZW5SdWxlc01vZGFsID0gZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgJHNjb3BlLnJ1bGVzX21vZGFsLnNob3coKTtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdDtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmNsb3NlUnVsZXNNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnJ1bGVzX21vZGFsLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnNtc19tb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgICAgICRzY29wZS5ydWxlc19tb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0FyZWFzQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScgLCdEQicsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSAsREIpIHtcblxuICAgICRzY29wZS5zZWFyY2ggPSB7JyQnOiAkc3RhdGVQYXJhbXMuc2VhcmNofTtcbiAgICAkc2NvcGUucXVlcnlCeSA9ICckJztcbiAgICAkc2NvcGUuY291bnR5ID0gJHN0YXRlUGFyYW1zLmNvdW50eTtcbiAgICBEQi5zZWFyY2goJycsICRzdGF0ZVBhcmFtcy5pZClcbiAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAkc2NvcGUuYXJlYXMgPSBkYXRhO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICAgICRzY29wZS5jbGVhclNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3RvZG86IGNsZWFyIHNlYXJjaCBmaWVsZFxuICAgIH07XG4gICAgJHNjb3BlLnNjcm9sbFRvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICB9O1xuXG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0NvbnRhY3RDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ2xvY2FsU3RvcmFnZScsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgJHNjb3BlLmNvbnRhY3RJbmZvID0gbG9jYWxTdG9yYWdlLmdldCgnY29udGFjdEluZm8nKTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0NvdW50aWVzQ3RybCcsIFsnJHNjb3BlJywgJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCBEQikge1xuICAgIERCLmdldENvdW50aWVzKClcbiAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5jb3VudGllcyA9IGRhdGE7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdGaXNoRGV0YWlsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEQikge1xuICAgICRzY29wZS5maXNoID0gJHN0YXRlUGFyYW1zLmZpc2g7XG4gICAgJHNjb3BlLmltYWdlX2VuZHBvaW50ID0gJ2h0dHA6Ly93d3cuaWZpc2tlLnNlJztcbiAgICBpZighJHNjb3BlLmZpc2gpIHtcbiAgICAgICAgREIuZ2V0RmlzaCgkc3RhdGVQYXJhbXMuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRzY29wZS5maXNoID0gZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlzaCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCRzY29wZS5maXNoKTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0Zpc2hlc0N0cmwnLCBbJyRzY29wZScsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgREIpIHtcbiAgICAkc2NvcGUuc29ydG9yZGVyID0gJ3NvJztcbiAgICAkc2NvcGUuaW1hZ2VfZW5kcG9pbnQgPSAnaHR0cDovL3d3dy5pZmlza2Uuc2UnO1xuICAgIERCLmdldEZpc2hlcygpXG4gICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUuZmlzaGVzID0gZGF0YTtcbiAgICAgICAgJHNjb3BlLmRlZmF1bHRfaW1nID0gZGF0YVswXS5pbWc7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdIb21lQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJGlvbmljSGlzdG9yeScsXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJ3Nlc3Npb25EYXRhJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSwgbG9jYWxTdG9yYWdlLCBzZXNzaW9uRGF0YSkge1xuXG4gICAgICAgICRzY29wZS5sb2dnZWRJbiA9IHNlc3Npb25EYXRhO1xuXG4gICAgICAgIC8vIEN1cnJlbnQgaGlzdG9yeSBzdGFjayBJZC4gU2VlIGFyZWFfY29udHJvbGxlciBmb3IgdXNhZ2UuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoJ2hvbWVIaXN0b3J5SWQnLCAkaW9uaWNIaXN0b3J5LmN1cnJlbnRIaXN0b3J5SWQoKSk7XG5cbiAgICAgICAgJHNjb3BlLm15RnVuYyA9IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgaWYoJGV2ZW50LmtleUNvZGUgPT0gMTMgJiYgISRldmVudC5zaGlmdEtleSkgeyAvL2lmIGVudGVyLWtleVxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5hcmVhcycsIHtzZWFyY2g6ICRldmVudC5zcmNFbGVtZW50LnZhbHVlfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0xlZ2FsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdsb2NhbFN0b3JhZ2UnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgbG9jYWxTdG9yYWdlKSB7XG4gICAgJHNjb3BlLnRvcyA9IGxvY2FsU3RvcmFnZS5nZXQoJ3RvcycpO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignTG9naW5DdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ1VwZGF0ZScsICckaW9uaWNMb2FkaW5nJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFVwZGF0ZSwgJGlvbmljTG9hZGluZykge1xuICAgIC8vJHNjb3BlLnVzZXIgPSB7fTtcbiAgICAkc2NvcGUuc2lnbkluID0gZnVuY3Rpb24obG9naW5Gb3JtKSB7XG4gICAgICAgICRpb25pY0xvYWRpbmcuc2hvdygpO1xuXG4gICAgICAgIFVwZGF0ZS51c2VyX2xvZ2luKGxvZ2luRm9ybS51c2VybmFtZS4kdmlld1ZhbHVlLCBsb2dpbkZvcm0ucGFzc3dvcmQuJHZpZXdWYWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICBsb2dpbkZvcm0uJHNldFZhbGlkaXR5KFwibG9naW5FcnJvclwiLCB0cnVlKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5ob21lJyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgIGxvZ2luRm9ybS4kc2V0VmFsaWRpdHkoXCJsb2dpbkVycm9yXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGVycm9yLnJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICB9O1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignTWVudUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRpb25pY1BvcG92ZXInLFxuICAgICdzZXNzaW9uRGF0YScsXG4gICAgJ1VwZGF0ZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRpb25pY1BvcG92ZXIsIHNlc3Npb25EYXRhLCBVcGRhdGUpIHtcblxuICAgICRzY29wZS5zZXNzaW9uRGF0YSA9IHNlc3Npb25EYXRhO1xuXG4gICAgJGlvbmljUG9wb3Zlci5mcm9tVGVtcGxhdGVVcmwoJ2NvbXBvbmVudHMvbWVudS9wb3BvdmVyLmh0bWwnLCB7XG4gICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHBvcG92ZXIpIHtcbiAgICAgICAgJHNjb3BlLnBvcG92ZXIgPSBwb3BvdmVyO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnVzZXJpbmZvID0gZnVuY3Rpb24oKSB7XG5cdCRzY29wZS5wb3BvdmVyLmhpZGUoKTtcblx0JHN0YXRlLmdvKCdtZW51LnVzZXJpbmZvJyk7XG4gICAgfTtcbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG5cdCRzY29wZS5wb3BvdmVyLmhpZGUoKTtcblx0VXBkYXRlLnVzZXJfbG9nb3V0KCk7XG5cblx0JHN0YXRlLmdvKCdzdGFydC5sb2dpbicpO1xuICAgIH07XG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKSB7XG5cdCRzY29wZS5wb3BvdmVyLmhpZGUoKTtcblx0JHN0YXRlLmdvKCdzdGFydC5sb2dpbicpO1xuICAgIH07XG4gICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKSB7XG5cdCRzY29wZS5wb3BvdmVyLmhpZGUoKTtcblx0JHN0YXRlLmdvKCdzdGFydC5yZWdpc3Rlci5hY2NvdW50X2RldGFpbHMnKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBVcGRhdGUuZm9yY2VkVXBkYXRlKCk7XG4gICAgfTtcblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckaW9uaWNMb2FkaW5nJywgJ0FQSScsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkaW9uaWNMb2FkaW5nLCBBUEkpIHtcblx0XG5cdHZhciB1c2VybmFtZSwgcGFzc3dvcmQsIHBob25lO1xuXHRcblx0JHNjb3BlLmFjY291bnREZXRhaWxzID0gZnVuY3Rpb24oZm9ybSkge1xuXHQgICAgdXNlcm5hbWUgPSBmb3JtLnVzZXJuYW1lLiR2aWV3VmFsdWU7XG5cdCAgICBwYXNzd29yZCA9IGZvcm0ucGFzc3dvcmQuJHZpZXdWYWx1ZTtcblx0ICAgICRzdGF0ZS5nbygnXi51c2VyRGV0YWlscycpO1xuXHR9O1xuXG5cdCRzY29wZS51c2VyRGV0YWlscyA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0ICAgICRpb25pY0xvYWRpbmcuc2hvdygpO1xuXG5cdCAgICB2YXIgZnVsbG5hbWUgPSBmb3JtLmZ1bGxuYW1lLiR2aWV3VmFsdWU7XG5cdCAgICB2YXIgZW1haWwgPSBmb3JtLmVtYWlsLiR2aWV3VmFsdWU7XG5cdCAgICBwaG9uZSA9ICRzY29wZS5waG9uZSA9IGZvcm0ucGhvbmUuJHZpZXdWYWx1ZTtcblx0ICAgIFxuXHQgICAgQVBJLnVzZXJfcmVnaXN0ZXIodXNlcm5hbWUsIGZ1bGxuYW1lLCBwYXNzd29yZCwgZW1haWwsIHBob25lKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgXG5cdFx0ICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuXHRcdCAgICAkc3RhdGUuZ28oJ14udmVyaWZ5Jyk7XG5cdFx0fSwgZnVuY3Rpb24oZXJyb3IpIHtcblx0XHQgICAgLy8gVG9EbzogZGlzcGxheSBlcnJvclxuXHRcdCAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUudmVyaWZ5ID0gZnVuY3Rpb24oZm9ybSkge1xuXHQgICAgJGlvbmljTG9hZGluZy5zaG93KCk7XG5cblx0ICAgIHZhciB2ZXJjb2RlID0gZm9ybS52ZXJjb2RlO1xuXHQgICAgXG5cdCAgICBBUEkudXNlcl9jb25maXJtKHVzZXJuYW1lLCB2ZXJjb2RlLiR2aWV3VmFsdWUpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdCAgICAkc3RhdGUuZ28oJ3N0YXJ0LmxvZ2luJyk7XG5cdFx0ICAgIHZlcmNvZGUuJHNldFZhbGlkaXR5KFwidmVyaWZpZWRcIiwgdHJ1ZSk7XG5cdFx0ICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuXG5cdFx0fSwgZnVuY3Rpb24oZXJyb3IpIHtcblx0XHQgICAgdmVyY29kZS4kc2V0VmFsaWRpdHkoXCJ2ZXJpZmllZFwiLCBmYWxzZSk7XG5cdFx0ICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuXHRcdH0pO1xuXHR9O1xuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ1RlY2huaXF1ZURldGFpbEN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnREInLCAnJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZScsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEQiwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSkge1xuICAgICRzY29wZS5pbWFnZV9lbmRwb2ludCA9ICdodHRwOi8vd3d3LmlmaXNrZS5zZSc7XG4gICAgJHNjb3BlLnRlY2ggPSAkc3RhdGVQYXJhbXMudGVjaDtcbiAgICAkc2NvcGUuaW1hZ2VzID0gW107XG5cbiAgICBpZighJHNjb3BlLnRlY2gpIHtcbiAgICAgICAgREIuZ2V0VGVjaG5pcXVlKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgJHNjb3BlLmltYWdlcyA9IFtkYXRhLmltZzEsIGRhdGEuaW1nMiwgZGF0YS5pbWczXS5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIS9cXC8kLy50ZXN0KGVsKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgJHNjb3BlLnRlY2ggPSBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGF0YSA9ICRzY29wZS50ZWNoO1xuICAgICAgICAkc2NvcGUuaW1hZ2VzID0gW2RhdGEuaW1nMSwgZGF0YS5pbWcyLCBkYXRhLmltZzNdLmZpbHRlcihmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgcmV0dXJuICEvXFwvJC8udGVzdChlbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XG4gICAgfVxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignVGVjaG5pcXVlc0N0cmwnLCBbJyRzY29wZScsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgREIpIHtcbiAgICBEQi5nZXRUZWNobmlxdWVzKClcbiAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAkc2NvcGUudGVjaG5pcXVlcyA9IGRhdGE7XG4gICAgfSk7XG4gICAgJHNjb3BlLmltYWdlX2VuZHBvaW50ID0gJ2h0dHA6Ly93d3cuaWZpc2tlLnNlJztcbiAgICAkc2NvcGUuc29ydG9yZGVyID0gJ3NvJztcblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignVXNlckN0cmwnLCBbJyRzY29wZScsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgREIpIHtcbiAgICBEQi5nZXRVc2VySW5mbygpXG4gICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgfSk7XG4gICAgREIuZ2V0VXNlck51bWJlcnMoKVxuICAgIC50aGVuKGZ1bmN0aW9uKG51bWJlcnMpIHtcbiAgICAgICAgJHNjb3BlLm51bWJlcnMgPSBudW1iZXJzO1xuICAgIH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignVXNlckNhcmRzQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEQikge1xuICAgICRzY29wZS5wcmVkID0gJy10byc7XG4gICAgJHNjb3BlLm5vdyA9IERhdGUubm93KCk7XG4gICAgREIuZ2V0VXNlclByb2R1Y3RzKClcbiAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5wcm9kdWN0cyA9IGRhdGE7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59XSk7XG4iLCIoZnVuY3Rpb24oYW5ndWxhciwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5hcGknLCBbJ2lmaXNrZS51dGlscyddKVxuICAgIC5wcm92aWRlcignQVBJJywgZnVuY3Rpb24gQVBJUHJvdmlkZXIoKSB7XG5cbiAgICAgICAgdGhpcy5iYXNlX3VybCA9ICdodHRwczovL3d3dy5pZmlza2Uuc2UvYXBpL3YyL2FwaS5waHAnO1xuXG4gICAgICAgIHRoaXMuJGdldCA9IFsnJGh0dHAnLCAnc2Vzc2lvbkRhdGEnLCAnbG9jYWxTdG9yYWdlJywgJyRxJywgZnVuY3Rpb24oJGh0dHAsIHNlc3Npb25EYXRhLCBsb2NhbFN0b3JhZ2UsICRxKSB7XG4gICAgICAgICAgICB2YXIgYmFzZV91cmwgPSB0aGlzLmJhc2VfdXJsO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICMgYXBpX2NhbGwgI1xuICAgICAgICAgICAgICogaGFuZGxlcyBodHRwIHJlcXVlc3RzXG4gICAgICAgICAgICAgKiByZXR1cm5zIGEgJGh0dHAgb2JqZWN0IGZvciB0aGUgcmVxdWVzdGVkIGFwaSBjYWxsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBhcGlfY2FsbCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAoXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOidnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYmFzZV91cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBhbmd1bGFyLmV4dGVuZChwYXJhbXMsIHsna2V5JzogJzAxMjM0NTY3ODlhYmNkZWYnfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogNTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC8vIFRvRG86IFByb3BlciBsb2dnaW5nXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuc3RhdHVzID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZywgc3RhdHVzVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1JlcXVlc3QgdGltZW91dCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIyBzZXNzaW9uX2FwaV9jYWxsICNcbiAgICAgICAgICAgICAqIHdyYXBwZXIgZm9yIGFwaV9jYWxsIC0gaW5zZXJ0cyB0aGUgc2Vzc2lvbiB0b2tlbiBpbnRvIHBhcmFtc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgc2Vzc2lvbl9hcGlfY2FsbCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHZhciBzZXNzaW9uID0gc2Vzc2lvbkRhdGEudG9rZW47XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKGFuZ3VsYXIuZXh0ZW5kKHBhcmFtcywge3M6IHNlc3Npb259KSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldF9tdW5pY2lwYWxpdGllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9tdW5pY2lwYWxpdGllcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9jb3VudGllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9jb3VudGllcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfZXhpc3RzOiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICd1c2VyX2V4aXN0cycsIHVzZXJuYW1lOiB1c2VybmFtZX0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9yZWdpc3RlcjogZnVuY3Rpb24odXNlcm5hbWUsIGZ1bGxuYW1lLCBwYXNzd29yZCwgZW1haWwsIHBob25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ3VzZXJfcmVnaXN0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9jb25maXJtOiBmdW5jdGlvbih1c2VybmFtZSwgcGluKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ3VzZXJfY29uZmlybScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpbjogcGluXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfaW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXNzaW9uX2FwaV9jYWxsKHttOiAndXNlcl9pbmZvJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9sb2dpbjogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ3VzZXJfbG9naW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbkRhdGEuc2V0VG9rZW4oZGF0YS5kYXRhLnJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbmVlZGVkIGZvciBjaGFpbmluZyBvZiBwcm9taXNlcywgc2hvdWxkIGJlIGRvbmUgc29tZSBvdGhlciB3YXkgcGVyaGFwcz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9sb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uX2FwaV9jYWxsKHttOiAndXNlcl9sb2dvdXQnfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbkRhdGEuZGVsZXRlVG9rZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2R1Y3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlc3Npb25fYXBpX2NhbGwoe206ICd1c2VyX3Byb2R1Y3RzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2Zpc2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9maXNoZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfdGVjaG5pcXVlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF90ZWNobmlxdWVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2JhaXRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X2JhaXRzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X29yZ2FuaXphdGlvbnM6IGZ1bmN0aW9uKG9yZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9vcmdhbml6YXRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdpZDogb3JnaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X29yZ19tb2RpZmllZDogZnVuY3Rpb24ob3JnaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X29yZ19tb2RpZmllZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnaWQ6IG9yZ2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9hcmVhczogZnVuY3Rpb24oYXJlYWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9hcmVhcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYWlkOiBhcmVhaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2FyZWFzX21vZGlmaWVkOiBmdW5jdGlvbihhcmVhaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X2FyZWFzX21vZGlmaWVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhaWQ6IGFyZWFpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfcHJvZHVjdHM6IGZ1bmN0aW9uKGFyZWFpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfcHJvZHVjdHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFpZDogYXJlYWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9ydWxlczogZnVuY3Rpb24ocnVsZWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9ydWxlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZWlkOiBydWxlaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X3Bob3RvczogZnVuY3Rpb24ob3JnaWQsIGFyZWFpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfcGhvdG9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdpZDogb3JnaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYWlkOiBhcmVhaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X21hcF9wb2lzOiBmdW5jdGlvbihvcmdpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfbWFwX3BvaXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2lkOiBvcmdpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfbWFwX3BvaV90eXBlcyA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfbWFwX3BvaV90eXBlcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9tYXBfcG9seWdvbnM6IGZ1bmN0aW9uKG9yZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9tYXBfcG9seWdvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2lkOiBvcmdpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX2dldF9mYXZvcml0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2Vzc2lvbl9hcGlfY2FsbCh7bTogJ3VzZXJfZ2V0X2Zhdm9yaXRlcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF90ZXJtc19vZl9zZXJ2aWNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X3Rlcm1zX29mX3NlcnZpY2UnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfY29udGFjdF9pbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X2NvbnRhY3RfaW5mbyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9lbmdpbmVfcG9saWNpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfZW5naW5lX3BvbGljaWVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X3Ntc190ZXJtczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9zbXNfdGVybXMnfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfV07XG4gICAgfSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhciwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5kYicsIFtdKVxuICAgIC5wcm92aWRlcignREInLCBmdW5jdGlvbiBEQlByb3ZpZGVyKCkge1xuXG4gICAgICAgIHRoaXMuJGdldCA9IFsgJyRjb3Jkb3ZhU1FMaXRlJywgJ0FQSScsICckcScsIGZ1bmN0aW9uKCRjb3Jkb3ZhU1FMaXRlLCBBUEksICRxKSB7XG5cblxuICAgICAgICAgICAgdmFyIGRiO1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5zcWxpdGVQbHVnaW4pIHtcbiAgICAgICAgICAgICAgICBkYiA9ICRjb3Jkb3ZhU1FMaXRlLm9wZW5EQignZmlza2ViYXNlbi5kYicpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cub3BlbkRhdGFiYXNlKSB7XG4gICAgICAgICAgICAgICAgZGIgPSB3aW5kb3cub3BlbkRhdGFiYXNlKCdmaXNrZWJhc2VuLmRiJywgJzEuMCcsICdmaXNrZWJhc2VuJywgMTAqMTAyNCoxMDI0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vdCBzdXBwb3J0ZWQgb24gdGhpcyBkZXZpY2UsIHNvcnJ5Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB2YXIgdGFibGVEZWYgPSB7XG4gICAgICAgICAgICAgICAgJ0FyZWEnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnb3JnaWQnLCAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2t3JywgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydub3RlJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYzEnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYzInLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYzMnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbTEnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbTInLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbTMnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbGF0JywgICAncmVhbCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2xuZycsICAgJ3JlYWwnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd6b29tJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsncG50JywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY2FyJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZW5nJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaGNwJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbWFwJywgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3dzYycsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21vZCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2QnLCAgICAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ0FyZWFfRmlzaCc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYWlkJywgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ZpZCcsICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydhbW91bnQnLCAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY29tbWVudCcsICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdQcm9kdWN0JzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QyJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbm8nLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpbScsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3BmJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYWknLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3JpJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjaCcsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsncHJpY2UnLCAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21vZCcsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydzbycsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaGwnLCAgICAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ0NvdW50eSc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsncycsICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2QnLCAgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdNdW5pY2lwYWxpdHknOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY0lEJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbmFtZScsICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnRmlzaCc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZCcsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21vZCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3NvJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21heCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ljb24nLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpbWcnLCAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaW4nLCAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2dlbycsICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydzaXplJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbGF0JywgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3JlYycsICAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1J1bGUnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd2ZXInLCAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2QnLCAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVXNlcl9Qcm9kdWN0JzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydhdCcsICAgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY29kZScsICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ZyJywgICAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydmdWxsbmFtZScsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ290JywgICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsncmVmMScsICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3JlZjInLCAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3RvJywgICAgICAgICdpbnQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1VzZXJfSW5mbyc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndXNlcm5hbWUnLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydsb2dnZWRpbicsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ0lQMScsICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnSVAyJywgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyduYW1lJywgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2VtYWlsJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY3JlYXRlZCcsICAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1VzZXJfTnVtYmVyJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ251bWJlcicsICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdUZWNobmlxdWUnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2QnLCAgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydzbycsICAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkZScsICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZGEnLCAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ljb24nLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpbWcxJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaW1nMicsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ltZzMnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd5b3V0dWJlJywgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdPcmdhbml6YXRpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZCcsICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjcCcsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3VybCcsICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY28nLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21vZCcsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd2YXQnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZHAnLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2Z2YScsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydvcmcnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbWwnLCAgICAgJ2ludCddXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGNyZWF0ZU9iamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0dmFsID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEucm93cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICByZXR2YWwucHVzaChkYXRhLnJvd3MuaXRlbShpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgICAgICAgICB9O1xuXG5cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3B1bGF0ZVRhYmxlOiBmdW5jdGlvbih0YWJsZSwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24gKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGIudHJhbnNhY3Rpb24oZnVuY3Rpb24odHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eC5leGVjdXRlU3FsKCdERUxFVEUgRlJPTSAnICsgdGFibGUgKyAnOycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWQgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2luZ2xlRGF0YSA9IGRhdGFbaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0RGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYmxlRGVmW3RhYmxlXS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0RGF0YS5wdXNoKHNpbmdsZURhdGFbdGFibGVEZWZbdGFibGVdW2ldWzBdXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lOU0VSVCBJTlRPJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1ZBTFVFUyg/JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsPycucmVwZWF0KGluc2VydERhdGEubGVuZ3RoLTEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyknXS5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4LmV4ZWN1dGVTcWwocXVlcnksIGluc2VydERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2xlYW5UYWJsZTogZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnRyYW5zYWN0aW9uKGZ1bmN0aW9uKHR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHguZXhlY3V0ZVNxbCgnREVMRVRFIEZST00gJyArIHRhYmxlICsgJzsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERyb3BzIGFsbCB0YWJsZXMgaW4gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBjbGVhblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNsZWFuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnRyYW5zYWN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdGFibGUgaW4gdGFibGVEZWYpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHguZXhlY3V0ZVNxbCgnRFJPUCBUQUJMRSBJRiBFWElTVFMgJyArIHRhYmxlICsgJzsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbW92ZWQgYWxsIHRhYmxlcycpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSW5pdGlhbGllcyB0aGUgdGFibGVzIGluIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnRyYW5zYWN0aW9uKCBmdW5jdGlvbiAodHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIHRhYmxlIGluIHRhYmxlRGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdcIicgKyB0YWJsZURlZlt0YWJsZV0uam9pbignX19fXCInKS5zcGxpdCgnLCcpLmpvaW4oJ1wiICcpLnNwbGl0KCdfX18nKS5qb2luKCcsICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJywgUFJJTUFSWSBLRVkoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdcIicgKyB0YWJsZURlZlt0YWJsZV1bMF1bMF0gKyAnXCInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJykpOydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4LmV4ZWN1dGVTcWwocXVlcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBHZXRzIGluZm9ybWF0aW9uIGFib3V0IGFuIGFyZWFcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldEFyZWFcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0QXJlYTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gQXJlYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIGlkID0gPydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLCBbaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIGZ1bmN0aW9uIChhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IGNyZWF0ZU9iamVjdChhcmVhKVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X3Bob3RvcyhvYmplY3Qub3JnaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5pbWFnZXMgPSBpbWFnZXMuZGF0YS5yZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldEFyZWFGaXNoZXM6IGZ1bmN0aW9uKGFpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoIGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIConLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIEFyZWFfRmlzaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0pPSU4gRmlzaCBPTiBBcmVhX0Zpc2guZmlkID0gRmlzaC5JRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIEFyZWFfRmlzaC5haWQgPSA/J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksIFthaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBTZWFyY2hlcyB0aGUgZGF0YWJhc2UgdXNpbmcgYSBxdWVyeVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogVGhlIHF1ZXJ5IGlzIG1hdGNoZWQgdG8gYSBuYW1lIGFuZC9vciBrZXl3b3JkXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBzZWFyY2hcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoc3RyaW5nXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBmdW5jdGlvbihzZWFyY2hzdHJpbmcsIGNvdW50eV9pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoIGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIConLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIEFyZWEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSB0IExJS0UgPycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvdW50eV9pZCA/ICdBTkQgYzEgPSA/JzonJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ09SREVSIEJZIHQnXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50eV9pZCA/IFsnJScgKyBzZWFyY2hzdHJpbmcgKyAnJScsIGNvdW50eV9pZF06WyclJyArIHNlYXJjaHN0cmluZyArICclJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdldHMgaW5mb3JtYXRpb24gYWJvdXQgYSBwcm9kdWN0XG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRQcm9kdWN0XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtJbnRlZ2VyfSBwcm9kdWN0X2lkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0UHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdF9pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCBESVNUSU5DVCAqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBQcm9kdWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgSUQgPSA/J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBbcHJvZHVjdF9pZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdldHMgYWxsIHByb2R1Y3RzIGZyb20gYW4gYXJlYVxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UHJvZHVjdHNCeUFyZWFcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IGFyZWFfaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRQcm9kdWN0c0J5QXJlYTogZnVuY3Rpb24oYXJlYV9pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCBESVNUSU5DVCBQcm9kdWN0LiosJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUnVsZS50IGFzIHJ1bGVfdCwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSdWxlLnZlciBhcyBydWxlX3ZlciwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSdWxlLmQgYXMgcnVsZV9kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBQcm9kdWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSk9JTiBSdWxlIE9OIFJ1bGUuSUQgPSBQcm9kdWN0LnJpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgYWkgPSA/JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnT1JERVIgQlkgc28nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFthcmVhX2lkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0Q291bnRpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCBESVNUSU5DVCBDb3VudHkuKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gQ291bnR5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSk9JTiBBcmVhIE9OIEFyZWEuYzEgPSBDb3VudHkuSUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdPUkRFUiBCWSBDb3VudHkudCdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRVc2VyUHJvZHVjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqIEZST00gVXNlcl9Qcm9kdWN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldEZpc2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUICogRlJPTSBGaXNoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldEZpc2g6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUICogRlJPTSBGaXNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgaWQgPSA/J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksIFtpZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSlbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldFRlY2huaXF1ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqIEZST00gVGVjaG5pcXVlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRUZWNobmlxdWU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUICogRlJPTSBUZWNobmlxdWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBJRCA9ID8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSwgW2lkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldE9yZ2FuaXphdGlvbjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKiBGUk9NIE9yZ2FuaXphdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIElEID0gPydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLCBbaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0VXNlckluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBVc2VyX0luZm8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCBmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KHVzZXIpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0VXNlck51bWJlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBVc2VyX051bWJlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XTtcbiAgICB9KTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuZmlsdGVycycsIFtdKVxuLmZpbHRlcignbm9icnMnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyg8YnI+XFxzKikrL2csICc8YnI+Jyk7XG4gICAgfTtcbn0pO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpZmlza2UudXBkYXRlJywgWydpZmlza2UuYXBpJywgJ2lmaXNrZS5kYicsICdpZmlza2UudXRpbHMnXSlcbiAgICAucHJvdmlkZXIoJ1VwZGF0ZScsIGZ1bmN0aW9uIFVwZGF0ZVByb3ZpZGVyKCkge1xuXG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gW1xuICAgICAgICAgICAgJ0FQSScsXG4gICAgICAgICAgICAnREInLFxuICAgICAgICAgICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgICAgICAgICAnJHEnLFxuICAgICAgICAgICAgJyRpb25pY0xvYWRpbmcnLFxuICAgICAgICAgICAgJ3Nlc3Npb25EYXRhJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKEFQSSwgREIsIGxvY2FsU3RvcmFnZSwgJHEsICRpb25pY0xvYWRpbmcsIHNlc3Npb25EYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgTEFTVF9VUERBVEUgPSAnbGFzdF91cGRhdGUnO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBvcHVsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9hcmVhcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpc2hBcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkYXRhLmRhdGEucmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpc2hlcyA9IGRhdGEuZGF0YS5yZXNwb25zZVtrZXldLmZpc2g7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgZmlzaEtleSBpbiBmaXNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpc2hBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lEJzoga2V5KydfJytmaXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZDogZmlzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaWQ6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IGZpc2hlc1tmaXNoS2V5XVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50OiBmaXNoZXNbZmlzaEtleV1bMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQi5wb3B1bGF0ZVRhYmxlKCdBcmVhJywgZGF0YS5kYXRhLnJlc3BvbnNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgREIucG9wdWxhdGVUYWJsZSgnQXJlYV9GaXNoJywgZmlzaEFycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIEFyZWEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X3Byb2R1Y3RzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnUHJvZHVjdCcsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBQcm9kdWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9jb3VudGllcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ0NvdW50eScsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBDb3VudHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X211bmljaXBhbGl0aWVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnTXVuaWNpcGFsaXR5JywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIE11bmljaXBhbGl0eScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfZmlzaGVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnRmlzaCcsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBGaXNoJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9ydWxlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ1J1bGUnLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgUnVsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfdGVjaG5pcXVlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ1RlY2huaXF1ZScsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBUZWNobmlxdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X29yZ2FuaXphdGlvbnMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdPcmdhbml6YXRpb24nLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgT3JnYW5pemF0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9wdWxhdGVVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLnVzZXJfcHJvZHVjdHMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdVc2VyX1Byb2R1Y3QnLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgVXNlcl9Qcm9kdWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLnVzZXJfaW5mbygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bWJlcnMgPSBkYXRhLmRhdGEucmVzcG9uc2UubnVtYmVycztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtQXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG51bWJlcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtQXJyLnB1c2goeydudW1iZXInOiBudW1iZXJzW2ldfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQi5wb3B1bGF0ZVRhYmxlKCdVc2VyX0luZm8nLCBbZGF0YS5kYXRhLnJlc3BvbnNlXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIFVzZXJfSW5mbycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZGF0YS5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgREIucG9wdWxhdGVUYWJsZSgnVXNlcl9OdW1iZXInLCBudW1BcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBVc2VyX051bWJlcnMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgY2xlYW5Vc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgREIuY2xlYW5UYWJsZSgnVXNlcl9Qcm9kdWN0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBEQi5jbGVhblRhYmxlKCdVc2VyX051bWJlcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgREIuY2xlYW5UYWJsZSgnVXNlcl9JbmZvJylcbiAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZlZCB1c2VyIGluZm8gZnJvbSBkYXRhYmFzZScpO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgcmVtb3ZlIHVzZXIgZGF0YSBmcm9tIGRhdGFiYXNlIScsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVGdW5jID0gZnVuY3Rpb24oZm9yY2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RVcGRhdGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZighZm9yY2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlID0gbG9jYWxTdG9yYWdlLmdldChMQVNUX1VQREFURSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYVdlZWsgPSAxMDAwKjM2MDAqMjQqNztcbiAgICAgICAgICAgICAgICAgICAgaWYoY3VycmVudFRpbWUgLSBsYXN0VXBkYXRlID4gYVdlZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERCLmluaXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaXRpYWxpemVkIERCIHN5c3RlbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlc3Npb25EYXRhLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVVc2VyKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwb3B1bGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBhbGwgdGhlIHRoaW5ncycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoTEFTVF9VUERBVEUsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVyci5lcnJvcl9jb2RlID09PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF1dGhlbnRpY2F0aW9uIGZhaWx1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogU2hvdyB0byB1c2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFuVXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUEkudXNlcl9sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dvdCBhbiBlcnJvciwgd2lsbCB0cnkgdG8gcmVjcmVhdGUgYWxsIHRhYmxlczogJywgZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIuY2xlYW4oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvcHVsYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgYWxsIHRoZSB0aGluZ3MnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoTEFTVF9VUERBVEUsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTdGlsbCBlcnJvciwgaGFuZGxlIGl0IScsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X3Rlcm1zX29mX3NlcnZpY2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoJ3RvcycsZGF0YS5kYXRhLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9zbXNfdGVybXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odGVybXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KCdzbXNfdGVybXMnLCB0ZXJtcy5kYXRhLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9jb250YWN0X2luZm8oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoJ2NvbnRhY3RJbmZvJywgZGF0YS5kYXRhLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihzZXNzaW9uRGF0YS50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgREIuaW5pdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6ZWQgREIgc3lzdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2Vzc2lvbkRhdGEudG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVVc2VyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm9fdXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRnVuYygpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIGZvcmNlZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVGdW5jKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHVzZXJfbG9nb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFuVXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLnVzZXJfbG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHVzZXJfbG9naW46IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFQSS51c2VyX2xvZ2luKHVzZXJuYW1lLCBwYXNzd29yZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsYXN0X3VwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldChMQVNUX1VQREFURSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfV07XG4gICAgfSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLnV0aWxzJywgW10pXG5cbi5mYWN0b3J5KCdsb2NhbFN0b3JhZ2UnLCBbJyR3aW5kb3cnLCBmdW5jdGlvbigkd2luZG93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH07XG59XSlcbi5zZXJ2aWNlKCdzZXNzaW9uRGF0YScsIFsnbG9jYWxTdG9yYWdlJywgZnVuY3Rpb24obG9jYWxTdG9yYWdlKSB7XG4gICAgdGhpcy50b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXQoJ3Nlc3Npb24nKTtcblxuICAgIHRoaXMuc2V0VG9rZW4gPSBmdW5jdGlvbih0KSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoJ3Nlc3Npb24nLCB0KTtcbiAgICAgICAgdGhpcy50b2tlbiA9IHQ7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiBzZXQnKTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlVG9rZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZSgnc2Vzc2lvbicpO1xuICAgICAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICAgICAgY29uc29sZS5sb2coJ3Rva2VuIHVuc2V0Jyk7XG4gICAgfTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCduZ0NvcmRvdmFTbXMnLCBbXSlcbi5kaXJlY3RpdmUoJ25nQ29yZG92YVNtcycsIFsnJGNvcmRvdmFTbXMnLCAnJGlvbmljUG9wdXAnLCBmdW5jdGlvbigkY29yZG92YVNtcywgJGlvbmljUG9wdXApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgJGlvbmljUG9wdXAucHJvbXB0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTa3JpdiBpbiBkaXR0IG5hbW4nLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dFR5cGU6ICd0ZXh0J1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdGSVNLQSAnICsgYXR0cnMubmdDb3Jkb3ZhU21zICsgJyAnICsgbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTbXMuc2VuZCgnNzI0NTYnLCBtZXNzYWdlLCAnSU5URU5UJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY3Vlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuZGlyZWN0aXZlcycpXG4gICAgLmRpcmVjdGl2ZSgnaWZpc2tlSW5wdXQnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0ICAgIHJlc3RyaWN0OiAnRScsXG5cdCAgICB0cmFuc2NsdWRlOiB0cnVlLFxuXG5cdCAgICBzY29wZToge1xuXHRcdG5hbWU6ICdAJyxcblx0XHRpZDogJ0AnLFxuXHRcdGxhYmVsOiAnQCcsXG5cdFx0cGxhY2Vob2xkZXI6ICdAJyxcblx0XHR0eXBlOiAnQCcsXG5cdFx0bmdQYXR0ZXJuOiAnQCcsXG5cdFx0bmdNb2RlbDogJz0/J1xuXG5cdCAgICB9LFxuXHQgICAgdGVtcGxhdGVVcmw6ICdkaXJlY3RpdmVzL2lucHV0X2ZpZWxkL2lmaXNrZV9pbnB1dC5odG1sJyxcblx0ICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdCRzY29wZS5pZCA9ICRzY29wZS5pZCB8fCAkc2NvcGUubmFtZTtcblx0XHQkc2NvcGUudHlwZSA9ICRzY29wZS50eXBlIHx8ICd0ZXh0Jztcblx0ICAgIH1cblx0fVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnc3lzdGVtQnJvd3NlcicsIFtdKVxuLmRpcmVjdGl2ZSgnc3lzdGVtQnJvd3NlcicsIFsnJGNvcmRvdmFJbkFwcEJyb3dzZXInLCBmdW5jdGlvbigkY29yZG92YUluQXBwQnJvd3Nlcikge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBhdHRycykge1xuICAgICAgICAgICAgZWwub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICRjb3Jkb3ZhSW5BcHBCcm93c2VyLm9wZW4oZWxbMF0uaHJlZiwgJ19zeXN0ZW0nKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XSlcbi5kaXJlY3RpdmUoJ2dsb2JhbFN5c3RlbUJyb3dzZXInLCBbJyRjb3Jkb3ZhSW5BcHBCcm93c2VyJywgZnVuY3Rpb24oJGNvcmRvdmFJbkFwcEJyb3dzZXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQuaHJlZiAmJiBlLnRhcmdldC5ob3N0ICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdCkge1xuICAgICAgICAgICAgICAgICAgICAkY29yZG92YUluQXBwQnJvd3Nlci5vcGVuKGUudGFyZ2V0LmhyZWYsICdfc3lzdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG4iLCIvKmFuZ3VsYXIubW9kdWxlKCd0cmVlVGFicycsIFsnaW9uaWMnXSlcbiAgICAuZGlyZWN0aXZlKCdpb25UYWJzJywgWyckcm9vdFNjb3BlJywnJHN0YXRlJywnJGlvbmljSGlzdG9yeScsJyRpb25pY1ZpZXdTd2l0Y2hlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSwgJGlvbmljVmlld1N3aXRjaGVyKSB7XG5cdGZ1bmN0aW9uIGdldFRhYlJvb3RTdGF0ZShzdGF0ZSkge1xuXHQgICAgdmFyIGlzUm9vdFN0YXRlO1xuXG5cdCAgICBpZiAoc3RhdGUucGFyZW50LnNlbGYuYWJzdHJhY3QpIHtcblx0XHRpc1Jvb3RTdGF0ZSA9IHN0YXRlLnNlbGYubmFtZTtcblx0ICAgIH0gZWxzZSB7XG5cdFx0aXNSb290U3RhdGUgPSBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuICBpc1Jvb3RTdGF0ZSB8fCBnZXRUYWJSb290U3RhdGUoc3RhdGUucGFyZW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzVGFiUm9vdFN0YXRlKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUuc2VsZi5uYW1lID09PSBnZXRUYWJSb290U3RhdGUoc3RhdGUpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0ICAgIHJlc3RyaWN0OiAnRUEnLFxuXHQgICAgcmVxdWlyZTogJ2lvblRhYnMnLFxuXHQgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcblx0XHRjb25zb2xlLmxvZygnczogJyxzY29wZSk7XG5cdFx0Y29uc29sZS5sb2coJ2U6ICcsZWxlbWVudCk7XG5cdFx0Y29uc29sZS5sb2coJ2E6ICcsYXR0cik7XG5cdFx0Y29uc29sZS5sb2coJ2M6ICcsY3RybCk7XG5cdFx0dmFyIHNlbGVjdFRhYiA9IGN0cmwuc2VsZWN0O1xuXHRcdGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24odGFiLCBzaG91bGRFbWl0RXZlbnQpIHtcblx0XHQgICAgdmFyIHNlbGVjdGVkVGFiID0gY3RybC5zZWxlY3RlZFRhYigpO1xuXG5cdFx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRzaG91bGRFbWl0RXZlbnQgPSAhISh0YWIubmF2Vmlld05hbWUgfHwgdGFiLnVpU3JlZik7XG5cdFx0ICAgIH1cblxuXHRcdCAgICBpZiAoc2VsZWN0ZWRUYWIgJiYgc2VsZWN0ZWRUYWIuJGhpc3RvcnlJZCA9PSB0YWIuJGhpc3RvcnlJZCAmJiAhaXNUYWJSb290U3RhdGUoJHN0YXRlLiRjdXJyZW50KSkge1xuXHRcdFx0aWYgKHNob3VsZEVtaXRFdmVudCkge1xuXHRcdFx0ICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcblx0XHRcdFx0ZGlzYWJsZUJhY2s6IHRydWUsXG5cdFx0XHRcdGhpc3RvcnlSb290OiBmYWxzZVxuXHRcdFx0ICAgIH0pO1xuXHRcdFx0ICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG5cdFx0XHQgICAgJHN0YXRlLmdvKGdldFRhYlJvb3RTdGF0ZSgkc3RhdGUuJGN1cnJlbnQpKTtcblx0XHRcdH1cblx0XHQgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRhYiAmJiBzZWxlY3RlZFRhYi4kaGlzdG9yeUlkID09IHRhYi4kaGlzdG9yeUlkICYmIGlzVGFiUm9vdFN0YXRlKCRzdGF0ZS4kY3VycmVudCkpIHtcblx0XHRcdHJldHVybjtcblx0XHQgICAgfSBlbHNlIHtcblx0XHRcdHNlbGVjdFRhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdCAgICB9XG5cdFx0fTtcblx0ICAgIH1cblx0fTtcbiAgICB9XSk7XG4qL1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9