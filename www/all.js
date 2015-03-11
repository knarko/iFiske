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
    'ngMessages'
])
.constant('$ionicLoadingConfig', {
    template: '<i class="icon ion-loading-b"></i>'
    // hideOnStateChange: true
})
.run(['$ionicPlatform', 'Update', function($ionicPlatform, Update) {
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

        Update.update();
    });
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
                            }, reject);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0X2NvbnRyb2xsZXIuanMiLCJhcmVhMi9hcmVhMl9jb250cm9sbGVyLmpzIiwiYXJlYV9saXN0L2FyZWFfbGlzdF9jb250cm9sbGVyLmpzIiwiY29udGFjdC9jb250YWN0X2NvbnRyb2xsZXIuanMiLCJjb3VudGllcy9jb3VudGllc19jb250cm9sbGVyLmpzIiwiZmlzaF9kZXRhaWwvZmlzaF9kZXRhaWxfY29udHJvbGxlci5qcyIsImZpc2hlcy9maXNoZXNfY29udHJvbGxlci5qcyIsImhvbWUvaG9tZV9jb250cm9sbGVyLmpzIiwibGVnYWwvbGVnYWxfY29udHJvbGxlci5qcyIsImxvZ2luL2xvZ2luX2NvbnRyb2xsZXIuanMiLCJtZW51L21lbnVfY29udHJvbGxlci5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyX2NvbnRyb2xsZXIuanMiLCJ0ZWNobmlxdWVfZGV0YWlsL3RlY2huaXF1ZV9kZXRhaWxfY29udHJvbGxlci5qcyIsInRlY2huaXF1ZXMvdGVjaG5pcXVlc19jb250cm9sbGVyLmpzIiwidXNlci91c2VyX2NvbnRyb2xsZXIuanMiLCJ1c2VyX2NhcmRzL3VzZXJfY2FyZHNfY29udHJvbGxlci5qcyIsImFwaS5qcyIsImRiLmpzIiwiZmlsdGVyLmpzIiwidXBkYXRlLmpzIiwidXRpbHMuanMiLCJpZmlza2Vfc21zL2lmaXNrZV9zbXMuanMiLCJpbnB1dF9maWVsZC9pZmlza2VfaW5wdXQuanMiLCJzeXN0ZW1fYnJvd3Nlci9zeXN0ZW1fYnJvd3Nlci5qcyIsInRyZWVfdGFicy90cmVlX3RhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnaWZpc2tlJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ2lmaXNrZS5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcblxuYW5ndWxhci5tb2R1bGUoJ2lmaXNrZScsIFtcbiAgICAnaW9uaWMnLFxuICAgICdpZmlza2UuY29udHJvbGxlcnMnLFxuICAgICdpZmlza2UuZGlyZWN0aXZlcycsXG4gICAgJ2lmaXNrZS5hcGknLFxuICAgICdpZmlza2UuZGInLFxuICAgICdpZmlza2UudXRpbHMnLFxuICAgICdpZmlza2UudXBkYXRlJyxcbiAgICAnaWZpc2tlLmZpbHRlcnMnLFxuICAgICdpb25pYy5pb24uaGVhZGVyU2hyaW5rJyxcbiAgICAnbmdDb3Jkb3ZhJyxcbiAgICAnc3lzdGVtQnJvd3NlcicsXG4gICAgJ25nQ29yZG92YVNtcycsXG4gICAgJ25nTWVzc2FnZXMnXG5dKVxuLmNvbnN0YW50KCckaW9uaWNMb2FkaW5nQ29uZmlnJywge1xuICAgIHRlbXBsYXRlOiAnPGkgY2xhc3M9XCJpY29uIGlvbi1sb2FkaW5nLWJcIj48L2k+J1xuICAgIC8vIGhpZGVPblN0YXRlQ2hhbmdlOiB0cnVlXG59KVxuLnJ1bihbJyRpb25pY1BsYXRmb3JtJywgJ1VwZGF0ZScsIGZ1bmN0aW9uKCRpb25pY1BsYXRmb3JtLCBVcGRhdGUpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICAgIGlmKHdpbmRvdy5pb25pYyAmJiB3aW5kb3cuaW9uaWMuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5pb25pYy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgVXBkYXRlLnVwZGF0ZSgpO1xuICAgIH0pO1xufV0pXG5cbi5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGlvbmljQ29uZmlnUHJvdmlkZXInLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaW9uaWNDb25maWdQcm92aWRlcikge1xuXG4gICAgLy8gQ2FjaGUgdmlld3MgaW4gdGhlIGZvcndhcmQgc3RhY2tcbiAgICAkaW9uaWNDb25maWdQcm92aWRlci52aWV3cy5mb3J3YXJkQ2FjaGUodHJ1ZSk7XG5cbiAgICAvLyBDbGVhciBiYWNrIGJ1dHRvbiBkZWZhdWx0IHRleHRcbiAgICAkaW9uaWNDb25maWdQcm92aWRlci5iYWNrQnV0dG9uLnByZXZpb3VzVGl0bGVUZXh0KGZhbHNlKS50ZXh0KCcnKTtcblxuICAgIC8vIFRhYnMgcG9zaXRpb25cbiAgICAkaW9uaWNDb25maWdQcm92aWRlci50YWJzLnBvc2l0aW9uKCdib3R0b20nKTtcblxuICAgIC8qKlxuICAgICAqIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlci4gTGVhcm4gbW9yZSBoZXJlOlxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRVcmwgPSAnL3N0YXJ0L2xvZ2luJztcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXNzaW9uJykpIHtcbiAgICAgICAgZGVmYXVsdFVybCA9ICcvbWVudS9ob21lJztcbiAgICB9XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShkZWZhdWx0VXJsKTtcblxuXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC8vIEFic3RyYWN0IHByZS1tZW51IHN0YXRlLiBOZWVkZWQgZm9yIG5hdmlnYXRpb24gYmV0d2VlbiBsb2dpbiBhbmQgcmVnaXN0ZXIgdmlld3MuXG4gICAgLnN0YXRlKCdzdGFydCcsIHtcbiAgICAgICAgdXJsOiAnL3N0YXJ0JyxcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9zdGFydC9zdGFydC5odG1sJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzdGFydC5sb2dpbicsIHtcbiAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzdGFydC5yZWdpc3RlcicsIHtcbiAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzdGFydC5yZWdpc3Rlci5hY2NvdW50RGV0YWlscycsIHtcbiAgICAgICAgdXJsOiAnL2FjY291bnRfZGV0YWlscycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZWdpc3Rlci9yZWdpc3Rlcl9hY2NvdW50X2RldGFpbHMuaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc3RhcnQucmVnaXN0ZXIudXNlckRldGFpbHMnLCB7XG4gICAgICAgIHVybDogJy91c2VyX2RldGFpbHMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVnaXN0ZXIvcmVnaXN0ZXJfdXNlcl9kZXRhaWxzLmh0bWwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LnJlZ2lzdGVyLnZlcmlmeScsIHtcbiAgICAgICAgdXJsOiAnL3ZlcmlmeScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZWdpc3Rlci9yZWdpc3Rlcl92ZXJpZnkuaHRtbCdcbiAgICB9KVxuXG4gICAgLy8gQWJzdHJhY3QgbWVudSBzdGF0ZS4gXCJSb290XCIgc3RhdGUgb25jZSB3ZSdyZSBwYXN0IHRoZSBsb2dpbiBzdGF0ZS5cbiAgICAuc3RhdGUoJ21lbnUnLCB7XG4gICAgICAgIHVybDogJy9tZW51JyxcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tZW51L21lbnUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5ob21lJywge1xuICAgICAgICB1cmw6ICcvaG9tZScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5pbmZvJywge1xuICAgICAgICB1cmw6ICcvaW5mbycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pbmZvL2luZm8uaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5jb250YWN0Jywge1xuICAgICAgICB1cmw6ICcvY29udGFjdCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9jb250YWN0L2NvbnRhY3QuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5sZWdhbCcsIHtcbiAgICAgICAgdXJsOiAnL2xlZ2FsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2xlZ2FsL2xlZ2FsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnTGVnYWxDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmFib3V0Jywge1xuXHR1cmw6ICcvYWJvdXQnLFxuXHR0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYWJvdXQvYWJvdXQuaHRtbCcsXG5cdGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUudXNlcmluZm8nLCB7XG4gICAgICAgIHVybDogJy91c2VyaW5mbycsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy91c2VyL3VzZXIuaHRtbCcsXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuY291bnRpZXMnLCB7XG4gICAgICAgIHVybDogJy9jb3VudGllcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9jb3VudGllcy9jb3VudGllcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0NvdW50aWVzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5hcmVhcycsIHtcbiAgICAgICAgdXJsOiAnL2FyZWFzJyxcbiAgICAgICAgcGFyYW1zOiB7J2lkJzogZmFsc2UsICdjb3VudHknOiBmYWxzZSwgJ3NlYXJjaCc6ICcnfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2FyZWFfbGlzdC9hcmVhX2xpc3QuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBcmVhc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuY2FyZHMnLCB7XG4gICAgICAgIHVybDogJy9jYXJkcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy91c2VyX2NhcmRzL3VzZXJfY2FyZHMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyQ2FyZHNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmZhdm9yaXRlcycsIHtcbiAgICAgICAgdXJsOiAnL2Zhdm9yaXRlcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9mYXZvcml0ZXMvZmF2b3JpdGVzLmh0bWwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuZmlzaGVzJywge1xuICAgICAgICB1cmw6ICcvZmlzaGVzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2Zpc2hlcy9maXNoZXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGaXNoZXNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmZpc2hkZXRhaWwnLCB7XG4gICAgICAgIHVybDogJy9maXNoZGV0YWlsLzppZCcsXG4gICAgICAgIHBhcmFtczogeydpZCc6IGZhbHNlLCAnZmlzaCc6IGZhbHNlfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2Zpc2hfZGV0YWlsL2Zpc2hfZGV0YWlsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRmlzaERldGFpbEN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUudGVjaG5pcXVlcycsIHtcbiAgICAgICAgdXJsOiAnL3RlY2huaXF1ZXMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvdGVjaG5pcXVlcy90ZWNobmlxdWVzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVGVjaG5pcXVlc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUudGVjaG5pcXVlZGV0YWlsJywge1xuICAgICAgICB1cmw6ICcvdGVjaG5pcXVlZGV0YWlsLzppZCcsXG4gICAgICAgIHBhcmFtczogeydpZCc6IGZhbHNlLCAndGVjaCc6IGZhbHNlfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3RlY2huaXF1ZV9kZXRhaWwvdGVjaG5pcXVlX2RldGFpbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1RlY2huaXF1ZURldGFpbEN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUucmVwb3J0Jywge1xuICAgICAgICB1cmw6ICcvcmVwb3J0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydC9yZXBvcnQuaHRtbCdcbiAgICB9KVxuXG4gICAgLnN0YXRlKCdhcmVhZGV0YWlsMicsIHtcbiAgICAgICAgYWJzdHJhY3Q6dHJ1ZSxcbiAgICAgICAgdXJsOiAnL2FyZWFkZXRhaWwvOmlkJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2FyZWEyL2FyZWEuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBcmVhQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnYXJlYWRldGFpbDIuaW5mbycsIHtcbiAgICAgICAgdXJsOiAnL2luZm8nLFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2luZm8nOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2FyZWEvYXJlYS5odG1sJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FyZWFkZXRhaWwyLmZpc2hpbmZvJywge1xuICAgICAgICB1cmw6ICcvZmlzaGluZm8nLFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2Zpc2hpbmZvJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9hcmVhX2Zpc2gvYXJlYV9maXNoLmh0bWwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXJlYWRldGFpbDIuY2FyZHMnLCB7XG4gICAgICAgIHVybDogJy9jYXJkcycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY2FyZHMnOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2FyZWFfY2FyZHMvYXJlYV9jYXJkcy5odG1sJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnLCBbXSk7XG5hbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmRpcmVjdGl2ZXMnLCBbXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQWJvdXRDdHJsJywgWyckc2NvcGUnLCckY29yZG92YUFwcFZlcnNpb24nLCAnJGlvbmljUGxhdGZvcm0nLCAnVXBkYXRlJywgZnVuY3Rpb24oJHNjb3BlLCAkY29yZG92YUFwcFZlcnNpb24sICRpb25pY1BsYXRmb3JtLCBVcGRhdGUpIHtcblx0JHNjb3BlLnZlcnNpb24gPSAkc2NvcGUuZGJEYXRlID0gJ09rXFx1MDBFNG50JztcbiAgICAkc2NvcGUuZGJEYXRlID0gVXBkYXRlLmxhc3RfdXBkYXRlKCk7XG5cblx0JGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG5cdCAgICBpZiAod2luZG93LmNvcmRvdmEpIHtcblx0XHQkY29yZG92YUFwcFZlcnNpb24uZ2V0QXBwVmVyc2lvbigpLnRoZW4oZnVuY3Rpb24odmVyc2lvbikge1xuXHRcdCAgICBjb25zb2xlLmxvZyh2ZXJzaW9uKTtcblx0XHQgICAgJHNjb3BlLnZlcnNpb24gPSB2ZXJzaW9uO1xuXHRcdH0pO1xuXHQgICAgfVxuXHR9KTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0FyZWFDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckaW9uaWNIaXN0b3J5JyxcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRpb25pY1ZpZXdTd2l0Y2hlcicsXG4gICAgJyRzdGF0ZVBhcmFtcycsXG4gICAgJ0RCJyxcbiAgICAnJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZScsXG4gICAgJyRpb25pY01vZGFsJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRpb25pY0hpc3RvcnksIGxvY2FsU3RvcmFnZSwgJHJvb3RTY29wZSwgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGVQYXJhbXMsIERCLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlLCAkaW9uaWNNb2RhbCkge1xuXG4gICAgICAgICRzY29wZS50YWJzQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgdmlldyBpcyBhdCB0aGUgdG9wIG9mIGl0cyBoaXN0b3J5IHN0YWNrXG4gICAgICAgICAgICBpZighJGlvbmljSGlzdG9yeS52aWV3SGlzdG9yeSgpLmN1cnJlbnRWaWV3LmluZGV4KSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogU3dpdGNoIHRvIHRoZSBob21lIGhpc3Rvcnkgc3RhY2tcbiAgICAgICAgICAgICAgICAgKiBTZWUgJGlvbmljSGlzdG9yeSBzb3VyY2UgZm9yIHRoZSBldmVuIGhhbmRsZXIgdXNlZFxuICAgICAgICAgICAgICAgICAqIFNlZSBob21lX2NvbnRyb2xsZXIuanMgZm9yIHRoZSBoaXN0b3J5SWQgdXNlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCckaW9uaWNIaXN0b3J5LmNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgaGlzdG9yeUlkOiBsb2NhbFN0b3JhZ2UuZ2V0KCdob21lSGlzdG9yeUlkJylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBiYWNrIGFjdGlvblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGlvbmljR29CYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmltYWdlX2VuZHBvaW50ID0gJ2h0dHA6Ly93d3cuaWZpc2tlLnNlJztcblxuICAgICAgICAvLyBBcmVhaW5mb1xuICAgICAgICBEQi5nZXRBcmVhKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgJHNjb3BlLmltYWdlcyA9IGFyZWEuaW1hZ2VzO1xuXG4gICAgICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgJHNjb3BlLmFyZWEgPSBhcmVhO1xuXG4gICAgICAgICAgICBEQi5nZXRPcmdhbml6YXRpb24oYXJlYS5vcmdpZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICRzY29wZS5vcmcgPSBvcmc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBEQi5nZXRBcmVhRmlzaGVzKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZmlzaGVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmaXNoZXMpO1xuICAgICAgICAgICAgJHNjb3BlLmZpc2hlcyA9IGZpc2hlcztcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgREIuZ2V0UHJvZHVjdHNCeUFyZWEoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihwcm9kdWN0cykge1xuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3RzID0gcHJvZHVjdHM7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXJlYSBmaXNoZXNcbiAgICAgICAgJHNjb3BlLnNvcnRvcmRlciA9ICctYW1vdW50JztcblxuICAgICAgICAvL0FyZWFfQ2FyZHNcbiAgICAgICAgJHNjb3BlLnNtc3Rlcm1zID0gbG9jYWxTdG9yYWdlLmdldCgnc21zX3Rlcm1zJyk7XG4gICAgICAgICRzY29wZS5wcmVkaWNhdGUgPSBcInNvXCI7XG5cblxuICAgICAgICAvL1NNUy1tb2RhbFxuICAgICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2NvbXBvbmVudHMvYXJlYV9jYXJkcy9tb2RhbC5odG1sJywge1xuICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgICAgICAgICAkc2NvcGUuc21zX21vZGFsID0gbW9kYWw7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgJHNjb3BlLnNtc19tb2RhbC5zaG93KCk7XG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHByb2R1Y3Q7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc21zX21vZGFsLmhpZGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnNob3dUZXJtcyA9IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgJHNjb3BlLnNob3dpbmd0ZXJtcyA9ICEkc2NvcGUuc2hvd2luZ3Rlcm1zO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuc2hvd2luZ3Rlcm1zID0gZmFsc2U7XG5cbiAgICAgICAgLy9SdWxlcyBtb2RhbFxuICAgICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2NvbXBvbmVudHMvYXJlYV9jYXJkcy9ydWxlc19tb2RhbC5odG1sJywge1xuICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgICAgICAgICAkc2NvcGUucnVsZXNfbW9kYWwgPSBtb2RhbDtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5vcGVuUnVsZXNNb2RhbCA9IGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICAgICAgICRzY29wZS5ydWxlc19tb2RhbC5zaG93KCk7XG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHByb2R1Y3Q7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5jbG9zZVJ1bGVzTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5ydWxlc19tb2RhbC5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5zbXNfbW9kYWwucmVtb3ZlKCk7XG4gICAgICAgICAgICAkc2NvcGUucnVsZXNfbW9kYWwucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdBcmVhc0N0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnICwnREInLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljU2Nyb2xsRGVsZWdhdGUgLERCKSB7XG5cbiAgICAkc2NvcGUuc2VhcmNoID0geyckJzogJHN0YXRlUGFyYW1zLnNlYXJjaH07XG4gICAgJHNjb3BlLnF1ZXJ5QnkgPSAnJCc7XG4gICAgJHNjb3BlLmNvdW50eSA9ICRzdGF0ZVBhcmFtcy5jb3VudHk7XG4gICAgREIuc2VhcmNoKCcnLCAkc3RhdGVQYXJhbXMuaWQpXG4gICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgJHNjb3BlLmFyZWFzID0gZGF0YTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgICAkc2NvcGUuY2xlYXJTZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy90b2RvOiBjbGVhciBzZWFyY2ggZmllbGRcbiAgICB9O1xuICAgICRzY29wZS5zY3JvbGxUb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XG4gICAgfTtcblxufV0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdDb250YWN0Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdsb2NhbFN0b3JhZ2UnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgbG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICRzY29wZS5jb250YWN0SW5mbyA9IGxvY2FsU3RvcmFnZS5nZXQoJ2NvbnRhY3RJbmZvJyk7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdDb3VudGllc0N0cmwnLCBbJyRzY29wZScsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgREIpIHtcbiAgICBEQi5nZXRDb3VudGllcygpXG4gICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUuY291bnRpZXMgPSBkYXRhO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignRmlzaERldGFpbEN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnREInLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgREIpIHtcbiAgICAkc2NvcGUuZmlzaCA9ICRzdGF0ZVBhcmFtcy5maXNoO1xuICAgICRzY29wZS5pbWFnZV9lbmRwb2ludCA9ICdodHRwOi8vd3d3LmlmaXNrZS5zZSc7XG4gICAgaWYoISRzY29wZS5maXNoKSB7XG4gICAgICAgIERCLmdldEZpc2goJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAkc2NvcGUuZmlzaCA9IGRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmZpc2gpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlzaCk7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdGaXNoZXNDdHJsJywgWyckc2NvcGUnLCAnREInLCBmdW5jdGlvbigkc2NvcGUsIERCKSB7XG4gICAgJHNjb3BlLnNvcnRvcmRlciA9ICdzbyc7XG4gICAgJHNjb3BlLmltYWdlX2VuZHBvaW50ID0gJ2h0dHA6Ly93d3cuaWZpc2tlLnNlJztcbiAgICBEQi5nZXRGaXNoZXMoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLmZpc2hlcyA9IGRhdGE7XG4gICAgICAgICRzY29wZS5kZWZhdWx0X2ltZyA9IGRhdGFbMF0uaW1nO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignSG9tZUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRpb25pY0hpc3RvcnknLFxuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdzZXNzaW9uRGF0YScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRpb25pY0hpc3RvcnksIGxvY2FsU3RvcmFnZSwgc2Vzc2lvbkRhdGEpIHtcblxuICAgICAgICAkc2NvcGUubG9nZ2VkSW4gPSBzZXNzaW9uRGF0YTtcblxuICAgICAgICAvLyBDdXJyZW50IGhpc3Rvcnkgc3RhY2sgSWQuIFNlZSBhcmVhX2NvbnRyb2xsZXIgZm9yIHVzYWdlLlxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KCdob21lSGlzdG9yeUlkJywgJGlvbmljSGlzdG9yeS5jdXJyZW50SGlzdG9yeUlkKCkpO1xuXG4gICAgICAgICRzY29wZS5teUZ1bmMgPSBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgIGlmKCRldmVudC5rZXlDb2RlID09IDEzICYmICEkZXZlbnQuc2hpZnRLZXkpIHsgLy9pZiBlbnRlci1rZXlcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuYXJlYXMnLCB7c2VhcmNoOiAkZXZlbnQuc3JjRWxlbWVudC52YWx1ZX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgfVxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdMZWdhbEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnbG9jYWxTdG9yYWdlJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIGxvY2FsU3RvcmFnZSkge1xuICAgICRzY29wZS50b3MgPSBsb2NhbFN0b3JhZ2UuZ2V0KCd0b3MnKTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdVcGRhdGUnLCAnJGlvbmljTG9hZGluZycsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVcGRhdGUsICRpb25pY0xvYWRpbmcpIHtcbiAgICAvLyRzY29wZS51c2VyID0ge307XG4gICAgJHNjb3BlLnNpZ25JbiA9IGZ1bmN0aW9uKGxvZ2luRm9ybSkge1xuICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coKTtcblxuICAgICAgICBVcGRhdGUudXNlcl9sb2dpbihsb2dpbkZvcm0udXNlcm5hbWUuJHZpZXdWYWx1ZSwgbG9naW5Gb3JtLnBhc3N3b3JkLiR2aWV3VmFsdWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgbG9naW5Gb3JtLiRzZXRWYWxpZGl0eShcImxvZ2luRXJyb3JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuaG9tZScpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICBsb2dpbkZvcm0uJHNldFZhbGlkaXR5KFwibG9naW5FcnJvclwiLCBmYWxzZSk7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBlcnJvci5yZXNwb25zZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ01lbnVDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckaW9uaWNQb3BvdmVyJyxcbiAgICAnc2Vzc2lvbkRhdGEnLFxuICAgICdVcGRhdGUnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkaW9uaWNQb3BvdmVyLCBzZXNzaW9uRGF0YSwgVXBkYXRlKSB7XG5cbiAgICAkc2NvcGUuc2Vzc2lvbkRhdGEgPSBzZXNzaW9uRGF0YTtcblxuICAgICRpb25pY1BvcG92ZXIuZnJvbVRlbXBsYXRlVXJsKCdjb21wb25lbnRzL21lbnUvcG9wb3Zlci5odG1sJywge1xuICAgICAgICBzY29wZTogJHNjb3BlXG4gICAgfSkudGhlbihmdW5jdGlvbihwb3BvdmVyKSB7XG4gICAgICAgICRzY29wZS5wb3BvdmVyID0gcG9wb3ZlcjtcbiAgICB9KTtcblxuICAgICRzY29wZS51c2VyaW5mbyA9IGZ1bmN0aW9uKCkge1xuXHQkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG5cdCRzdGF0ZS5nbygnbWVudS51c2VyaW5mbycpO1xuICAgIH07XG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuXHQkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG5cdFVwZGF0ZS51c2VyX2xvZ291dCgpO1xuXG5cdCRzdGF0ZS5nbygnc3RhcnQubG9naW4nKTtcbiAgICB9O1xuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuXHQkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG5cdCRzdGF0ZS5nbygnc3RhcnQubG9naW4nKTtcbiAgICB9O1xuICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCkge1xuXHQkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG5cdCRzdGF0ZS5nbygnc3RhcnQucmVnaXN0ZXIuYWNjb3VudF9kZXRhaWxzJyk7XG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgVXBkYXRlLmZvcmNlZFVwZGF0ZSgpO1xuICAgIH07XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdSZWdpc3RlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGlvbmljTG9hZGluZycsICdBUEknLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJGlvbmljTG9hZGluZywgQVBJKSB7XG5cdFxuXHR2YXIgdXNlcm5hbWUsIHBhc3N3b3JkLCBwaG9uZTtcblx0XG5cdCRzY29wZS5hY2NvdW50RGV0YWlscyA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0ICAgIHVzZXJuYW1lID0gZm9ybS51c2VybmFtZS4kdmlld1ZhbHVlO1xuXHQgICAgcGFzc3dvcmQgPSBmb3JtLnBhc3N3b3JkLiR2aWV3VmFsdWU7XG5cdCAgICAkc3RhdGUuZ28oJ14udXNlckRldGFpbHMnKTtcblx0fTtcblxuXHQkc2NvcGUudXNlckRldGFpbHMgPSBmdW5jdGlvbihmb3JtKSB7XG5cdCAgICAkaW9uaWNMb2FkaW5nLnNob3coKTtcblxuXHQgICAgdmFyIGZ1bGxuYW1lID0gZm9ybS5mdWxsbmFtZS4kdmlld1ZhbHVlO1xuXHQgICAgdmFyIGVtYWlsID0gZm9ybS5lbWFpbC4kdmlld1ZhbHVlO1xuXHQgICAgcGhvbmUgPSAkc2NvcGUucGhvbmUgPSBmb3JtLnBob25lLiR2aWV3VmFsdWU7XG5cdCAgICBcblx0ICAgIEFQSS51c2VyX3JlZ2lzdGVyKHVzZXJuYW1lLCBmdWxsbmFtZSwgcGFzc3dvcmQsIGVtYWlsLCBwaG9uZSlcblx0XHQudGhlbihmdW5jdGlvbihkYXRhKSB7IFxuXHRcdCAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcblx0XHQgICAgJHN0YXRlLmdvKCdeLnZlcmlmeScpO1xuXHRcdH0sIGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0ICAgIC8vIFRvRG86IGRpc3BsYXkgZXJyb3Jcblx0XHQgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0JHNjb3BlLnZlcmlmeSA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0ICAgICRpb25pY0xvYWRpbmcuc2hvdygpO1xuXG5cdCAgICB2YXIgdmVyY29kZSA9IGZvcm0udmVyY29kZTtcblx0ICAgIFxuXHQgICAgQVBJLnVzZXJfY29uZmlybSh1c2VybmFtZSwgdmVyY29kZS4kdmlld1ZhbHVlKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHQgICAgJHN0YXRlLmdvKCdzdGFydC5sb2dpbicpO1xuXHRcdCAgICB2ZXJjb2RlLiRzZXRWYWxpZGl0eShcInZlcmlmaWVkXCIsIHRydWUpO1xuXHRcdCAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcblxuXHRcdH0sIGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0ICAgIHZlcmNvZGUuJHNldFZhbGlkaXR5KFwidmVyaWZpZWRcIiwgZmFsc2UpO1xuXHRcdCAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcblx0XHR9KTtcblx0fTtcbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdUZWNobmlxdWVEZXRhaWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ0RCJywgJyRpb25pY1NsaWRlQm94RGVsZWdhdGUnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgREIsICRpb25pY1NsaWRlQm94RGVsZWdhdGUpIHtcbiAgICAkc2NvcGUuaW1hZ2VfZW5kcG9pbnQgPSAnaHR0cDovL3d3dy5pZmlza2Uuc2UnO1xuICAgICRzY29wZS50ZWNoID0gJHN0YXRlUGFyYW1zLnRlY2g7XG4gICAgJHNjb3BlLmltYWdlcyA9IFtdO1xuXG4gICAgaWYoISRzY29wZS50ZWNoKSB7XG4gICAgICAgIERCLmdldFRlY2huaXF1ZSgkc3RhdGVQYXJhbXMuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRzY29wZS5pbWFnZXMgPSBbZGF0YS5pbWcxLCBkYXRhLmltZzIsIGRhdGEuaW1nM10uZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEvXFwvJC8udGVzdChlbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS51cGRhdGUoKTtcbiAgICAgICAgICAgICRzY29wZS50ZWNoID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkc2NvcGUudGVjaDtcbiAgICAgICAgJHNjb3BlLmltYWdlcyA9IFtkYXRhLmltZzEsIGRhdGEuaW1nMiwgZGF0YS5pbWczXS5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAhL1xcLyQvLnRlc3QoZWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xuICAgIH1cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ1RlY2huaXF1ZXNDdHJsJywgWyckc2NvcGUnLCAnREInLCBmdW5jdGlvbigkc2NvcGUsIERCKSB7XG4gICAgREIuZ2V0VGVjaG5pcXVlcygpXG4gICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgJHNjb3BlLnRlY2huaXF1ZXMgPSBkYXRhO1xuICAgIH0pO1xuICAgICRzY29wZS5pbWFnZV9lbmRwb2ludCA9ICdodHRwOi8vd3d3LmlmaXNrZS5zZSc7XG4gICAgJHNjb3BlLnNvcnRvcmRlciA9ICdzbyc7XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgWyckc2NvcGUnLCAnREInLCBmdW5jdGlvbigkc2NvcGUsIERCKSB7XG4gICAgREIuZ2V0VXNlckluZm8oKVxuICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgIH0pO1xuICAgIERCLmdldFVzZXJOdW1iZXJzKClcbiAgICAudGhlbihmdW5jdGlvbihudW1iZXJzKSB7XG4gICAgICAgICRzY29wZS5udW1iZXJzID0gbnVtYmVycztcbiAgICB9KTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ1VzZXJDYXJkc0N0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnREInLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgREIpIHtcbiAgICAkc2NvcGUucHJlZCA9ICctdG8nO1xuICAgICRzY29wZS5ub3cgPSBEYXRlLm5vdygpO1xuICAgIERCLmdldFVzZXJQcm9kdWN0cygpXG4gICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBkYXRhO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufV0pO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpZmlza2UuYXBpJywgWydpZmlza2UudXRpbHMnXSlcbiAgICAucHJvdmlkZXIoJ0FQSScsIGZ1bmN0aW9uIEFQSVByb3ZpZGVyKCkge1xuXG4gICAgICAgIHRoaXMuYmFzZV91cmwgPSAnaHR0cHM6Ly93d3cuaWZpc2tlLnNlL2FwaS92Mi9hcGkucGhwJztcblxuICAgICAgICB0aGlzLiRnZXQgPSBbJyRodHRwJywgJ3Nlc3Npb25EYXRhJywgJ2xvY2FsU3RvcmFnZScsICckcScsIGZ1bmN0aW9uKCRodHRwLCBzZXNzaW9uRGF0YSwgbG9jYWxTdG9yYWdlLCAkcSkge1xuICAgICAgICAgICAgdmFyIGJhc2VfdXJsID0gdGhpcy5iYXNlX3VybDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAjIGFwaV9jYWxsICNcbiAgICAgICAgICAgICAqIGhhbmRsZXMgaHR0cCByZXF1ZXN0c1xuICAgICAgICAgICAgICogcmV0dXJucyBhICRodHRwIG9iamVjdCBmb3IgdGhlIHJlcXVlc3RlZCBhcGkgY2FsbFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgYXBpX2NhbGwgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICRodHRwKFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDonZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGJhc2VfdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogYW5ndWxhci5leHRlbmQocGFyYW1zLCB7J2tleSc6ICcwMTIzNDU2Nzg5YWJjZGVmJ30pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAvLyBUb0RvOiBQcm9wZXIgbG9nZ2luZ1xuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLnN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdSZXF1ZXN0IHRpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICMgc2Vzc2lvbl9hcGlfY2FsbCAjXG4gICAgICAgICAgICAgKiB3cmFwcGVyIGZvciBhcGlfY2FsbCAtIGluc2VydHMgdGhlIHNlc3Npb24gdG9rZW4gaW50byBwYXJhbXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHNlc3Npb25fYXBpX2NhbGwgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2Vzc2lvbiA9IHNlc3Npb25EYXRhLnRva2VuO1xuICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChhbmd1bGFyLmV4dGVuZChwYXJhbXMsIHtzOiBzZXNzaW9ufSkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRfbXVuaWNpcGFsaXRpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfbXVuaWNpcGFsaXRpZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfY291bnRpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfY291bnRpZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX2V4aXN0czogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAndXNlcl9leGlzdHMnLCB1c2VybmFtZTogdXNlcm5hbWV9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfcmVnaXN0ZXI6IGZ1bmN0aW9uKHVzZXJuYW1lLCBmdWxsbmFtZSwgcGFzc3dvcmQsIGVtYWlsLCBwaG9uZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICd1c2VyX3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHBob25lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfY29uZmlybTogZnVuY3Rpb24odXNlcm5hbWUsIHBpbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICd1c2VyX2NvbmZpcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaW46IHBpblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX2luZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2Vzc2lvbl9hcGlfY2FsbCh7bTogJ3VzZXJfaW5mbyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfbG9naW46IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICd1c2VyX2xvZ2luJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25EYXRhLnNldFRva2VuKGRhdGEuZGF0YS5yZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL25lZWRlZCBmb3IgY2hhaW5pbmcgb2YgcHJvbWlzZXMsIHNob3VsZCBiZSBkb25lIHNvbWUgb3RoZXIgd2F5IHBlcmhhcHM/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfbG9nb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbl9hcGlfY2FsbCh7bTogJ3VzZXJfbG9nb3V0J30pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25EYXRhLmRlbGV0ZVRva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9wcm9kdWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXNzaW9uX2FwaV9jYWxsKHttOiAndXNlcl9wcm9kdWN0cyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9maXNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfZmlzaGVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X3RlY2huaXF1ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfdGVjaG5pcXVlcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9iYWl0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9iYWl0cyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9vcmdhbml6YXRpb25zOiBmdW5jdGlvbihvcmdpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfb3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnaWQ6IG9yZ2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9vcmdfbW9kaWZpZWQ6IGZ1bmN0aW9uKG9yZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9vcmdfbW9kaWZpZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2lkOiBvcmdpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfYXJlYXM6IGZ1bmN0aW9uKGFyZWFpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfYXJlYXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFpZDogYXJlYWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9hcmVhc19tb2RpZmllZDogZnVuY3Rpb24oYXJlYWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9hcmVhc19tb2RpZmllZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYWlkOiBhcmVhaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X3Byb2R1Y3RzOiBmdW5jdGlvbihhcmVhaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X3Byb2R1Y3RzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhaWQ6IGFyZWFpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfcnVsZXM6IGZ1bmN0aW9uKHJ1bGVpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfcnVsZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVpZDogcnVsZWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9waG90b3M6IGZ1bmN0aW9uKG9yZ2lkLCBhcmVhaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X3Bob3RvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnaWQ6IG9yZ2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFpZDogYXJlYWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9tYXBfcG9pczogZnVuY3Rpb24ob3JnaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X21hcF9wb2lzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdpZDogb3JnaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X21hcF9wb2lfdHlwZXMgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X21hcF9wb2lfdHlwZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfbWFwX3BvbHlnb25zOiBmdW5jdGlvbihvcmdpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfbWFwX3BvbHlnb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdpZDogb3JnaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9nZXRfZmF2b3JpdGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlc3Npb25fYXBpX2NhbGwoe206ICd1c2VyX2dldF9mYXZvcml0ZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfdGVybXNfb2Zfc2VydmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF90ZXJtc19vZl9zZXJ2aWNlJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2NvbnRhY3RfaW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9jb250YWN0X2luZm8nfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfZW5naW5lX3BvbGljaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X2VuZ2luZV9wb2xpY2llcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9zbXNfdGVybXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfc21zX3Rlcm1zJ30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dO1xuICAgIH0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdpZmlza2UuZGInLCBbXSlcbiAgICAucHJvdmlkZXIoJ0RCJywgZnVuY3Rpb24gREJQcm92aWRlcigpIHtcblxuICAgICAgICB0aGlzLiRnZXQgPSBbICckY29yZG92YVNRTGl0ZScsICdBUEknLCAnJHEnLCBmdW5jdGlvbigkY29yZG92YVNRTGl0ZSwgQVBJLCAkcSkge1xuXG5cbiAgICAgICAgICAgIHZhciBkYjtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc3FsaXRlUGx1Z2luKSB7XG4gICAgICAgICAgICAgICAgZGIgPSAkY29yZG92YVNRTGl0ZS5vcGVuREIoJ2Zpc2tlYmFzZW4uZGInKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm9wZW5EYXRhYmFzZSkge1xuICAgICAgICAgICAgICAgIGRiID0gd2luZG93Lm9wZW5EYXRhYmFzZSgnZmlza2ViYXNlbi5kYicsICcxLjAnLCAnZmlza2ViYXNlbicsIDEwKjEwMjQqMTAyNCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3Qgc3VwcG9ydGVkIG9uIHRoaXMgZGV2aWNlLCBzb3JyeScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdmFyIHRhYmxlRGVmID0ge1xuICAgICAgICAgICAgICAgICdBcmVhJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ29yZ2lkJywgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydrdycsICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbm90ZScsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2MxJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2MyJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2MzJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ20xJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ20yJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ20zJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2xhdCcsICAgJ3JlYWwnXSxcbiAgICAgICAgICAgICAgICAgICAgWydsbmcnLCAgICdyZWFsJ10sXG4gICAgICAgICAgICAgICAgICAgIFsnem9vbScsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3BudCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NhcicsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2VuZycsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2hjcCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21hcCcsICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd3c2MnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtb2QnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkJywgICAgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdBcmVhX0Zpc2gnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2FpZCcsICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydmaWQnLCAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYW1vdW50JywgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NvbW1lbnQnLCAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnUHJvZHVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0MicsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ25vJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaW0nLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydwZicsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2FpJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydyaScsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY2gnLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3ByaWNlJywgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtb2QnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnc28nLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2hsJywgICAgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdDb3VudHknOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3MnLCAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkJywgICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnTXVuaWNpcGFsaXR5JzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NJRCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ25hbWUnLCAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ0Zpc2gnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2QnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtb2QnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydzbycsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtYXgnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpY29uJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaW1nJywgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2luJywgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydnZW8nLCAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnc2l6ZScsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2xhdCcsICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydyZWMnLCAgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdSdWxlJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndmVyJywgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkJywgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1VzZXJfUHJvZHVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnYXQnLCAgICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NvZGUnLCAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydmcicsICAgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZnVsbG5hbWUnLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydvdCcsICAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3JlZjEnLCAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydyZWYyJywgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0bycsICAgICAgICAnaW50J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdVc2VyX0luZm8nOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3VzZXJuYW1lJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbG9nZ2VkaW4nLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydJUDEnLCAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ0lQMicsICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbmFtZScsICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydlbWFpbCcsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NyZWF0ZWQnLCAgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdVc2VyX051bWJlcic6IFtcbiAgICAgICAgICAgICAgICAgICAgWydudW1iZXInLCAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVGVjaG5pcXVlJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkJywgICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnc28nLCAgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZGUnLCAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2RhJywgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpY29uJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaW1nMScsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ltZzInLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpbWczJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsneW91dHViZScsICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnT3JnYW5pemF0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2QnLCAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnY3AnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd1cmwnLCAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NvJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtb2QnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndmF0JywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2RwJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydmdmEnLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnb3JnJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ21sJywgICAgICdpbnQnXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBjcmVhdGVPYmplY3QgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldHZhbCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLnJvd3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dmFsLnB1c2goZGF0YS5yb3dzLml0ZW0oaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgICAgICAgICAgfTtcblxuXG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcG9wdWxhdGVUYWJsZTogZnVuY3Rpb24odGFibGUsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnRyYW5zYWN0aW9uKGZ1bmN0aW9uKHR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHguZXhlY3V0ZVNxbCgnREVMRVRFIEZST00gJyArIHRhYmxlICsgJzsnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNpbmdsZURhdGEgPSBkYXRhW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluc2VydERhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJsZURlZlt0YWJsZV0ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydERhdGEucHVzaChzaW5nbGVEYXRhW3RhYmxlRGVmW3RhYmxlXVtpXVswXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJTlNFUlQgSU5UTycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdWQUxVRVMoPycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLD8nLnJlcGVhdChpbnNlcnREYXRhLmxlbmd0aC0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcpJ10uam9pbignICcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eC5leGVjdXRlU3FsKHF1ZXJ5LCBpbnNlcnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNsZWFuVGFibGU6IGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbiAoZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYi50cmFuc2FjdGlvbihmdW5jdGlvbih0eCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4LmV4ZWN1dGVTcWwoJ0RFTEVURSBGUk9NICcgKyB0YWJsZSArICc7Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBEcm9wcyBhbGwgdGFibGVzIGluIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgY2xlYW5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjbGVhbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbiAoZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYi50cmFuc2FjdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih0eCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIHRhYmxlIGluIHRhYmxlRGVmKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4LmV4ZWN1dGVTcWwoJ0RST1AgVEFCTEUgSUYgRVhJU1RTICcgKyB0YWJsZSArICc7Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZW1vdmVkIGFsbCB0YWJsZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEluaXRpYWxpZXMgdGhlIHRhYmxlcyBpbiB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYi50cmFuc2FjdGlvbiggZnVuY3Rpb24gKHR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB0YWJsZSBpbiB0YWJsZURlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCInICsgdGFibGVEZWZbdGFibGVdLmpvaW4oJ19fX1wiJykuc3BsaXQoJywnKS5qb2luKCdcIiAnKS5zcGxpdCgnX19fJykuam9pbignLCAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsIFBSSU1BUlkgS0VZKCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCInICsgdGFibGVEZWZbdGFibGVdWzBdWzBdICsgJ1wiJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcpKTsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eC5leGVjdXRlU3FsKHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cblxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogR2V0cyBpbmZvcm1hdGlvbiBhYm91dCBhbiBhcmVhXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRBcmVhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtJbnRlZ2VyfSBpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldEFyZWE6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIConLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIEFyZWEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBpZCA9ID8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSwgW2lkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCBmdW5jdGlvbiAoYXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSBjcmVhdGVPYmplY3QoYXJlYSlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9waG90b3Mob2JqZWN0Lm9yZ2lkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGltYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaW1hZ2VzID0gaW1hZ2VzLmRhdGEucmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwob2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRBcmVhRmlzaGVzOiBmdW5jdGlvbihhaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKCBmdW5jdGlvbiAoZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBBcmVhX0Zpc2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdKT0lOIEZpc2ggT04gQXJlYV9GaXNoLmZpZCA9IEZpc2guSUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBBcmVhX0Zpc2guYWlkID0gPydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLCBbYWlkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogU2VhcmNoZXMgdGhlIGRhdGFiYXNlIHVzaW5nIGEgcXVlcnlcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIFRoZSBxdWVyeSBpcyBtYXRjaGVkIHRvIGEgbmFtZSBhbmQvb3Iga2V5d29yZFxuICAgICAgICAgICAgICAgICAqIEBtZXRob2Qgc2VhcmNoXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaHN0cmluZ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24oc2VhcmNoc3RyaW5nLCBjb3VudHlfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKCBmdW5jdGlvbiAoZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBBcmVhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgdCBMSUtFID8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb3VudHlfaWQgPyAnQU5EIGMxID0gPyc6JycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdPUkRFUiBCWSB0J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHlfaWQgPyBbJyUnICsgc2VhcmNoc3RyaW5nICsgJyUnLCBjb3VudHlfaWRdOlsnJScgKyBzZWFyY2hzdHJpbmcgKyAnJSddKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBHZXRzIGluZm9ybWF0aW9uIGFib3V0IGEgcHJvZHVjdFxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UHJvZHVjdFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gcHJvZHVjdF9pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3RfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgRElTVElOQ1QgKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gUHJvZHVjdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIElEID0gPydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgW3Byb2R1Y3RfaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBHZXRzIGFsbCBwcm9kdWN0cyBmcm9tIGFuIGFyZWFcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldFByb2R1Y3RzQnlBcmVhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtJbnRlZ2VyfSBhcmVhX2lkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0UHJvZHVjdHNCeUFyZWE6IGZ1bmN0aW9uKGFyZWFfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgRElTVElOQ1QgUHJvZHVjdC4qLCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1J1bGUudCBhcyBydWxlX3QsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUnVsZS52ZXIgYXMgcnVsZV92ZXIsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUnVsZS5kIGFzIHJ1bGVfZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gUHJvZHVjdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0pPSU4gUnVsZSBPTiBSdWxlLklEID0gUHJvZHVjdC5yaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIGFpID0gPycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ09SREVSIEJZIHNvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXJlYV9pZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldENvdW50aWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgRElTVElOQ1QgQ291bnR5LionLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIENvdW50eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0pPSU4gQXJlYSBPTiBBcmVhLmMxID0gQ291bnR5LklEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnT1JERVIgQlkgQ291bnR5LnQnXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0VXNlclByb2R1Y3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKiBGUk9NIFVzZXJfUHJvZHVjdCdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRGaXNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqIEZST00gRmlzaCdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRGaXNoOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqIEZST00gRmlzaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIGlkID0gPydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLCBbaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRUZWNobmlxdWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKiBGUk9NIFRlY2huaXF1ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0VGVjaG5pcXVlOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqIEZST00gVGVjaG5pcXVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgSUQgPSA/J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksIFtpZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSlbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRPcmdhbml6YXRpb246IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUICogRlJPTSBPcmdhbml6YXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBJRCA9ID8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSwgW2lkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFVzZXJJbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gVXNlcl9JbmZvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiggZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdCh1c2VyKVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFVzZXJOdW1iZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gVXNlcl9OdW1iZXInXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfV07XG4gICAgfSk7XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmZpbHRlcnMnLCBbXSlcbi5maWx0ZXIoJ25vYnJzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC8oPGJyPlxccyopKy9nLCAnPGJyPicpO1xuICAgIH07XG59KTtcbiIsIihmdW5jdGlvbihhbmd1bGFyLCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLnVwZGF0ZScsIFsnaWZpc2tlLmFwaScsICdpZmlza2UuZGInLCAnaWZpc2tlLnV0aWxzJ10pXG4gICAgLnByb3ZpZGVyKCdVcGRhdGUnLCBmdW5jdGlvbiBVcGRhdGVQcm92aWRlcigpIHtcblxuXG4gICAgICAgIHRoaXMuJGdldCA9IFtcbiAgICAgICAgICAgICdBUEknLFxuICAgICAgICAgICAgJ0RCJyxcbiAgICAgICAgICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICAgICAgICAgJyRxJyxcbiAgICAgICAgICAgICckaW9uaWNMb2FkaW5nJyxcbiAgICAgICAgICAgICdzZXNzaW9uRGF0YScsXG4gICAgICAgICAgICBmdW5jdGlvbihBUEksIERCLCBsb2NhbFN0b3JhZ2UsICRxLCAkaW9uaWNMb2FkaW5nLCBzZXNzaW9uRGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIExBU1RfVVBEQVRFID0gJ2xhc3RfdXBkYXRlJztcblxuICAgICAgICAgICAgICAgIHZhciBwb3B1bGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfYXJlYXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXNoQXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGF0YS5kYXRhLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXNoZXMgPSBkYXRhLmRhdGEucmVzcG9uc2Vba2V5XS5maXNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGZpc2hLZXkgaW4gZmlzaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXNoQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJRCc6IGtleSsnXycrZmlzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWQ6IGZpc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWlkOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBmaXNoZXNbZmlzaEtleV1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudDogZmlzaGVzW2Zpc2hLZXldWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgREIucG9wdWxhdGVUYWJsZSgnQXJlYScsIGRhdGEuZGF0YS5yZXNwb25zZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERCLnBvcHVsYXRlVGFibGUoJ0FyZWFfRmlzaCcsIGZpc2hBcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBBcmVhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9wcm9kdWN0cygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ1Byb2R1Y3QnLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgUHJvZHVjdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfY291bnRpZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdDb3VudHknLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgQ291bnR5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9tdW5pY2lwYWxpdGllcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ011bmljaXBhbGl0eScsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBNdW5pY2lwYWxpdHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X2Zpc2hlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ0Zpc2gnLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgRmlzaCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfcnVsZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdSdWxlJywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIFJ1bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X3RlY2huaXF1ZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdUZWNobmlxdWUnLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgVGVjaG5pcXVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9vcmdhbml6YXRpb25zKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnT3JnYW5pemF0aW9uJywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIE9yZ2FuaXphdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIHBvcHVsYXRlVXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS51c2VyX3Byb2R1Y3RzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnVXNlcl9Qcm9kdWN0JywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIFVzZXJfUHJvZHVjdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS51c2VyX2luZm8oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXJzID0gZGF0YS5kYXRhLnJlc3BvbnNlLm51bWJlcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bUFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBudW1iZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bUFyci5wdXNoKHsnbnVtYmVyJzogbnVtYmVyc1tpXX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgREIucG9wdWxhdGVUYWJsZSgnVXNlcl9JbmZvJywgW2RhdGEuZGF0YS5yZXNwb25zZV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBVc2VyX0luZm8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmRhdGEucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERCLnBvcHVsYXRlVGFibGUoJ1VzZXJfTnVtYmVyJywgbnVtQXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgVXNlcl9OdW1iZXJzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIGNsZWFuVXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIERCLmNsZWFuVGFibGUoJ1VzZXJfUHJvZHVjdCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgREIuY2xlYW5UYWJsZSgnVXNlcl9OdW1iZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERCLmNsZWFuVGFibGUoJ1VzZXJfSW5mbycpXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbW92ZWQgdXNlciBpbmZvIGZyb20gZGF0YWJhc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IHJlbW92ZSB1c2VyIGRhdGEgZnJvbSBkYXRhYmFzZSEnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRnVuYyA9IGZ1bmN0aW9uKGZvcmNlZCkge1xuICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VXBkYXRlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZvcmNlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZSA9IGxvY2FsU3RvcmFnZS5nZXQoTEFTVF9VUERBVEUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFXZWVrID0gMTAwMCozNjAwKjI0Kjc7XG4gICAgICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRUaW1lIC0gbGFzdFVwZGF0ZSA+IGFXZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEQi5pbml0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbml0aWFsaXplZCBEQiBzeXN0ZW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzZXNzaW9uRGF0YS50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlVXNlcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9wdWxhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgYWxsIHRoZSB0aGluZ3MnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KExBU1RfVVBEQVRFLCBjdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlcnIuZXJyb3JfY29kZSA9PT0gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdXRoZW50aWNhdGlvbiBmYWlsdXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFNob3cgdG8gdXNlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhblVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQVBJLnVzZXJfbG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHb3QgYW4gZXJyb3IsIHdpbGwgdHJ5IHRvIHJlY3JlYXRlIGFsbCB0YWJsZXM6ICcsIGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLmNsZWFuKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwb3B1bGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIGFsbCB0aGUgdGhpbmdzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KExBU1RfVVBEQVRFLCBjdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3RpbGwgZXJyb3IsIGhhbmRsZSBpdCEnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF90ZXJtc19vZl9zZXJ2aWNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KCd0b3MnLGRhdGEuZGF0YS5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfc21zX3Rlcm1zKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHRlcm1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldCgnc21zX3Rlcm1zJywgdGVybXMuZGF0YS5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfY29udGFjdF9pbmZvKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KCdjb250YWN0SW5mbycsIGRhdGEuZGF0YS5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoc2Vzc2lvbkRhdGEudG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERCLmluaXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaXRpYWxpemVkIERCIHN5c3RlbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlc3Npb25EYXRhLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlVXNlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vX3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICBmb3JjZWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRnVuYyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICB1c2VyX2xvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhblVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS51c2VyX2xvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB1c2VyX2xvZ2luOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBBUEkudXNlcl9sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVGdW5jKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdF91cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXQoTEFTVF9VUERBVEUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1dO1xuICAgIH0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS51dGlscycsIFtdKVxuXG4uZmFjdG9yeSgnbG9jYWxTdG9yYWdlJywgWyckd2luZG93JywgZnVuY3Rpb24oJHdpbmRvdykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pXG4uc2VydmljZSgnc2Vzc2lvbkRhdGEnLCBbJ2xvY2FsU3RvcmFnZScsIGZ1bmN0aW9uKGxvY2FsU3RvcmFnZSkge1xuICAgIHRoaXMudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0KCdzZXNzaW9uJyk7XG5cbiAgICB0aGlzLnNldFRva2VuID0gZnVuY3Rpb24odCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0KCdzZXNzaW9uJywgdCk7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0O1xuICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gc2V0Jyk7XG4gICAgfTtcbiAgICB0aGlzLmRlbGV0ZVRva2VuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmUoJ3Nlc3Npb24nKTtcbiAgICAgICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiB1bnNldCcpO1xuICAgIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnbmdDb3Jkb3ZhU21zJywgW10pXG4uZGlyZWN0aXZlKCduZ0NvcmRvdmFTbXMnLCBbJyRjb3Jkb3ZhU21zJywgJyRpb25pY1BvcHVwJywgZnVuY3Rpb24oJGNvcmRvdmFTbXMsICRpb25pY1BvcHVwKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWwsIGF0dHJzKSB7XG4gICAgICAgICAgICBlbC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLnByb21wdCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2tyaXYgaW4gZGl0dCBuYW1uJyxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRUeXBlOiAndGV4dCdcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnRklTS0EgJyArIGF0dHJzLm5nQ29yZG92YVNtcyArICcgJyArIG5hbWU7XG4gICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU21zLnNlbmQoJzcyNDU2JywgbWVzc2FnZSwgJ0lOVEVOVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2N1ZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2lmaXNrZUlucHV0JywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdCAgICByZXN0cmljdDogJ0UnLFxuXHQgICAgdHJhbnNjbHVkZTogdHJ1ZSxcblxuXHQgICAgc2NvcGU6IHtcblx0XHRuYW1lOiAnQCcsXG5cdFx0aWQ6ICdAJyxcblx0XHRsYWJlbDogJ0AnLFxuXHRcdHBsYWNlaG9sZGVyOiAnQCcsXG5cdFx0dHlwZTogJ0AnLFxuXHRcdG5nUGF0dGVybjogJ0AnLFxuXHRcdG5nTW9kZWw6ICc9PydcblxuXHQgICAgfSxcblx0ICAgIHRlbXBsYXRlVXJsOiAnZGlyZWN0aXZlcy9pbnB1dF9maWVsZC9pZmlza2VfaW5wdXQuaHRtbCcsXG5cdCAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcblx0XHQkc2NvcGUuaWQgPSAkc2NvcGUuaWQgfHwgJHNjb3BlLm5hbWU7XG5cdFx0JHNjb3BlLnR5cGUgPSAkc2NvcGUudHlwZSB8fCAndGV4dCc7XG5cdCAgICB9XG5cdH1cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3N5c3RlbUJyb3dzZXInLCBbXSlcbi5kaXJlY3RpdmUoJ3N5c3RlbUJyb3dzZXInLCBbJyRjb3Jkb3ZhSW5BcHBCcm93c2VyJywgZnVuY3Rpb24oJGNvcmRvdmFJbkFwcEJyb3dzZXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkY29yZG92YUluQXBwQnJvd3Nlci5vcGVuKGVsWzBdLmhyZWYsICdfc3lzdGVtJyk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pXG4uZGlyZWN0aXZlKCdnbG9iYWxTeXN0ZW1Ccm93c2VyJywgWyckY29yZG92YUluQXBwQnJvd3NlcicsIGZ1bmN0aW9uKCRjb3Jkb3ZhSW5BcHBCcm93c2VyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWwsIGF0dHJzKSB7XG4gICAgICAgICAgICBlbC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmhyZWYgJiYgZS50YXJnZXQuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFJbkFwcEJyb3dzZXIub3BlbihlLnRhcmdldC5ocmVmLCAnX3N5c3RlbScpO1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuIiwiLyphbmd1bGFyLm1vZHVsZSgndHJlZVRhYnMnLCBbJ2lvbmljJ10pXG4gICAgLmRpcmVjdGl2ZSgnaW9uVGFicycsIFsnJHJvb3RTY29wZScsJyRzdGF0ZScsJyRpb25pY0hpc3RvcnknLCckaW9uaWNWaWV3U3dpdGNoZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRpb25pY0hpc3RvcnksICRpb25pY1ZpZXdTd2l0Y2hlcikge1xuXHRmdW5jdGlvbiBnZXRUYWJSb290U3RhdGUoc3RhdGUpIHtcblx0ICAgIHZhciBpc1Jvb3RTdGF0ZTtcblxuXHQgICAgaWYgKHN0YXRlLnBhcmVudC5zZWxmLmFic3RyYWN0KSB7XG5cdFx0aXNSb290U3RhdGUgPSBzdGF0ZS5zZWxmLm5hbWU7XG5cdCAgICB9IGVsc2Uge1xuXHRcdGlzUm9vdFN0YXRlID0gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiAgaXNSb290U3RhdGUgfHwgZ2V0VGFiUm9vdFN0YXRlKHN0YXRlLnBhcmVudCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1RhYlJvb3RTdGF0ZShzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLnNlbGYubmFtZSA9PT0gZ2V0VGFiUm9vdFN0YXRlKHN0YXRlKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdCAgICByZXN0cmljdDogJ0VBJyxcblx0ICAgIHJlcXVpcmU6ICdpb25UYWJzJyxcblx0ICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG5cdFx0Y29uc29sZS5sb2coJ3M6ICcsc2NvcGUpO1xuXHRcdGNvbnNvbGUubG9nKCdlOiAnLGVsZW1lbnQpO1xuXHRcdGNvbnNvbGUubG9nKCdhOiAnLGF0dHIpO1xuXHRcdGNvbnNvbGUubG9nKCdjOiAnLGN0cmwpO1xuXHRcdHZhciBzZWxlY3RUYWIgPSBjdHJsLnNlbGVjdDtcblx0XHRjdHJsLnNlbGVjdCA9IGZ1bmN0aW9uKHRhYiwgc2hvdWxkRW1pdEV2ZW50KSB7XG5cdFx0ICAgIHZhciBzZWxlY3RlZFRhYiA9IGN0cmwuc2VsZWN0ZWRUYWIoKTtcblxuXHRcdCAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0c2hvdWxkRW1pdEV2ZW50ID0gISEodGFiLm5hdlZpZXdOYW1lIHx8IHRhYi51aVNyZWYpO1xuXHRcdCAgICB9XG5cblx0XHQgICAgaWYgKHNlbGVjdGVkVGFiICYmIHNlbGVjdGVkVGFiLiRoaXN0b3J5SWQgPT0gdGFiLiRoaXN0b3J5SWQgJiYgIWlzVGFiUm9vdFN0YXRlKCRzdGF0ZS4kY3VycmVudCkpIHtcblx0XHRcdGlmIChzaG91bGRFbWl0RXZlbnQpIHtcblx0XHRcdCAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG5cdFx0XHRcdGRpc2FibGVCYWNrOiB0cnVlLFxuXHRcdFx0XHRoaXN0b3J5Um9vdDogZmFsc2Vcblx0XHRcdCAgICB9KTtcblx0XHRcdCAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuXHRcdFx0ICAgICRzdGF0ZS5nbyhnZXRUYWJSb290U3RhdGUoJHN0YXRlLiRjdXJyZW50KSk7XG5cdFx0XHR9XG5cdFx0ICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUYWIgJiYgc2VsZWN0ZWRUYWIuJGhpc3RvcnlJZCA9PSB0YWIuJGhpc3RvcnlJZCAmJiBpc1RhYlJvb3RTdGF0ZSgkc3RhdGUuJGN1cnJlbnQpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0ICAgIH0gZWxzZSB7XG5cdFx0XHRzZWxlY3RUYWIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHQgICAgfVxuXHRcdH07XG5cdCAgICB9XG5cdH07XG4gICAgfV0pO1xuKi9cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==