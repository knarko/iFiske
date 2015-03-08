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
        controller: 'Area2Ctrl'
    })
    .state('areadetail2.info', {
        url: '/info',
        views: {
            'info': {
                controller: 'AreaDetailCtrl',
                templateUrl: 'components/area/area.html'
            }
        }
    })
    .state('areadetail2.fishinfo', {
        url: '/fishinfo',
        views: {
            'fishinfo': {
                controller: 'AreaFishInfoCtrl',
                templateUrl: 'components/area_fish/area_fish.html'
            }
        }
    })
    .state('areadetail2.cards', {
        url: '/cards',
        views: {
            'cards': {
                controller: 'AreaDetailCardCtrl',
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
.controller('AreaDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    function($scope, $stateParams, DB, $ionicSlideBoxDelegate) {
        $scope.image_endpoint = 'http://www.ifiske.se';
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
    }
]);

angular.module('ifiske.controllers')
.controller('Area2Ctrl', [
    '$scope',
    '$ionicHistory',
    'localStorage',
    '$rootScope',
    '$ionicViewSwitcher',
    '$stateParams',
    function($scope, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher, $stateParams) {

        console.log($stateParams);
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
}]);

angular.module('ifiske.controllers')
.controller('AreaDetailCardCtrl', ['$scope', 'DB', '$stateParams', '$ionicModal', 'localStorage', function($scope, DB, $stateParams, $ionicModal, localStorage) {
    $scope.smsterms = localStorage.get('sms_terms');
    $scope.predicate = "so";
    DB.getProductsByArea($stateParams.id)
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
        console.log(err);
    });

    //SMS-modal

    $ionicModal.fromTemplateUrl('components/area_cards/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function(product) {
        $scope.modal.show();
        $scope.product = product;
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.rules_modal.remove();
    });

    $scope.showingterms = false;
    $scope.showTerms = function($event) {
        $scope.showingterms = !$scope.showingterms;
    };

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

}]);


angular.module('ifiske.controllers')
.controller('AreaFishInfoCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.sortorder = '-amount';
    $scope.image_endpoint = 'https://www.ifiske.se/';
    DB.getAreaFishes($stateParams.id)
    .then(function(fishes) {
        $scope.fishes = fishes;
        console.log(fishes);
    });
    DB.getArea($stateParams.id)
    .then(function(area) {
        $scope.area = area;

        DB.getOrganization(area.orgid)
        .then(function(org) {
            $scope.org = org;
        });
    }, function(err) {
        console.log(err);
    });
}]);

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
.controller('HomeCtrl', ['$scope', '$state', '$ionicHistory', 'localStorage', function($scope, $state, $ionicHistory, localStorage) {

    // Current history stack Id. See area_controller for usage.
    localStorage.set('homeHistoryId', $ionicHistory.currentHistoryId());

    $scope.myFunc = function($event) {
        if($event.keyCode == 13 && !$event.shiftKey) { //if enter-key
            $state.go('menu.areas', {search: $event.srcElement.value});
        }

    };
}]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0X2NvbnRyb2xsZXIuanMiLCJhcmVhL2FyZWFfY29udHJvbGxlci5qcyIsImFyZWEyL2FyZWEyX2NvbnRyb2xsZXIuanMiLCJhcmVhX2NhcmRzL2FyZWFfY2FyZHNfY29udHJvbGxlci5qcyIsImFyZWFfZmlzaC9hcmVhX2Zpc2hfY29udHJvbGxlci5qcyIsImFyZWFfbGlzdC9hcmVhX2xpc3RfY29udHJvbGxlci5qcyIsImNvbnRhY3QvY29udGFjdF9jb250cm9sbGVyLmpzIiwiY291bnRpZXMvY291bnRpZXNfY29udHJvbGxlci5qcyIsImZpc2hfZGV0YWlsL2Zpc2hfZGV0YWlsX2NvbnRyb2xsZXIuanMiLCJmaXNoZXMvZmlzaGVzX2NvbnRyb2xsZXIuanMiLCJob21lL2hvbWVfY29udHJvbGxlci5qcyIsImxlZ2FsL2xlZ2FsX2NvbnRyb2xsZXIuanMiLCJsb2dpbi9sb2dpbl9jb250cm9sbGVyLmpzIiwibWVudS9tZW51X2NvbnRyb2xsZXIuanMiLCJyZWdpc3Rlci9yZWdpc3Rlcl9jb250cm9sbGVyLmpzIiwidGVjaG5pcXVlX2RldGFpbC90ZWNobmlxdWVfZGV0YWlsX2NvbnRyb2xsZXIuanMiLCJ0ZWNobmlxdWVzL3RlY2huaXF1ZXNfY29udHJvbGxlci5qcyIsInVzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwidXNlcl9jYXJkcy91c2VyX2NhcmRzX2NvbnRyb2xsZXIuanMiLCJhcGkuanMiLCJkYi5qcyIsImZpbHRlci5qcyIsInVwZGF0ZS5qcyIsInV0aWxzLmpzIiwiaWZpc2tlX3Ntcy9pZmlza2Vfc21zLmpzIiwiaW5wdXRfZmllbGQvaWZpc2tlX2lucHV0LmpzIiwic3lzdGVtX2Jyb3dzZXIvc3lzdGVtX2Jyb3dzZXIuanMiLCJ0cmVlX3RhYnMvdHJlZV90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdpZmlza2UnIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnaWZpc2tlLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuXG5hbmd1bGFyLm1vZHVsZSgnaWZpc2tlJywgW1xuICAgICdpb25pYycsXG4gICAgJ2lmaXNrZS5jb250cm9sbGVycycsXG4gICAgJ2lmaXNrZS5kaXJlY3RpdmVzJyxcbiAgICAnaWZpc2tlLmFwaScsXG4gICAgJ2lmaXNrZS5kYicsXG4gICAgJ2lmaXNrZS51dGlscycsXG4gICAgJ2lmaXNrZS51cGRhdGUnLFxuICAgICdpZmlza2UuZmlsdGVycycsXG4gICAgJ2lvbmljLmlvbi5oZWFkZXJTaHJpbmsnLFxuICAgICduZ0NvcmRvdmEnLFxuICAgICdzeXN0ZW1Ccm93c2VyJyxcbiAgICAnbmdDb3Jkb3ZhU21zJyxcbiAgICAnbmdNZXNzYWdlcydcbl0pXG4uY29uc3RhbnQoJyRpb25pY0xvYWRpbmdDb25maWcnLCB7XG4gICAgdGVtcGxhdGU6ICc8aSBjbGFzcz1cImljb24gaW9uLWxvYWRpbmctYlwiPjwvaT4nXG4gICAgLy8gaGlkZU9uU3RhdGVDaGFuZ2U6IHRydWVcbn0pXG4ucnVuKFsnJGlvbmljUGxhdGZvcm0nLCAnVXBkYXRlJywgZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0sIFVwZGF0ZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAgICAgaWYod2luZG93LmlvbmljICYmIHdpbmRvdy5pb25pYy5LZXlib2FyZCkge1xuICAgICAgICAgICAgd2luZG93LmlvbmljLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZih3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAgICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBVcGRhdGUudXBkYXRlKCk7XG4gICAgfSk7XG59XSlcblxuLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaW9uaWNDb25maWdQcm92aWRlcicsIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XG5cbiAgICAvLyBDYWNoZSB2aWV3cyBpbiB0aGUgZm9yd2FyZCBzdGFja1xuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnZpZXdzLmZvcndhcmRDYWNoZSh0cnVlKTtcblxuICAgIC8vIENsZWFyIGJhY2sgYnV0dG9uIGRlZmF1bHQgdGV4dFxuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xuXG4gICAgLy8gVGFicyBwb3NpdGlvblxuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnRhYnMucG9zaXRpb24oJ2JvdHRvbScpO1xuXG4gICAgLyoqXG4gICAgICogSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyLiBMZWFybiBtb3JlIGhlcmU6XG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gICAgICovXG5cbiAgICB2YXIgZGVmYXVsdFVybCA9ICcvc3RhcnQvbG9naW4nO1xuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Nlc3Npb24nKSkge1xuICAgICAgICBkZWZhdWx0VXJsID0gJy9tZW51L2hvbWUnO1xuICAgIH1cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKGRlZmF1bHRVcmwpO1xuXG5cblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLy8gQWJzdHJhY3QgcHJlLW1lbnUgc3RhdGUuIE5lZWRlZCBmb3IgbmF2aWdhdGlvbiBiZXR3ZWVuIGxvZ2luIGFuZCByZWdpc3RlciB2aWV3cy5cbiAgICAuc3RhdGUoJ3N0YXJ0Jywge1xuICAgICAgICB1cmw6ICcvc3RhcnQnLFxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3N0YXJ0L3N0YXJ0Lmh0bWwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LmxvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LnJlZ2lzdGVyJywge1xuICAgICAgICB1cmw6ICcvcmVnaXN0ZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVnaXN0ZXIvcmVnaXN0ZXIuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3N0YXJ0LnJlZ2lzdGVyLmFjY291bnREZXRhaWxzJywge1xuICAgICAgICB1cmw6ICcvYWNjb3VudF9kZXRhaWxzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlZ2lzdGVyL3JlZ2lzdGVyX2FjY291bnRfZGV0YWlscy5odG1sJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzdGFydC5yZWdpc3Rlci51c2VyRGV0YWlscycsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJfZGV0YWlscycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZWdpc3Rlci9yZWdpc3Rlcl91c2VyX2RldGFpbHMuaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc3RhcnQucmVnaXN0ZXIudmVyaWZ5Jywge1xuICAgICAgICB1cmw6ICcvdmVyaWZ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlZ2lzdGVyL3JlZ2lzdGVyX3ZlcmlmeS5odG1sJ1xuICAgIH0pXG5cbiAgICAvLyBBYnN0cmFjdCBtZW51IHN0YXRlLiBcIlJvb3RcIiBzdGF0ZSBvbmNlIHdlJ3JlIHBhc3QgdGhlIGxvZ2luIHN0YXRlLlxuICAgIC5zdGF0ZSgnbWVudScsIHtcbiAgICAgICAgdXJsOiAnL21lbnUnLFxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21lbnUvbWVudS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ01lbnVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmhvbWUnLCB7XG4gICAgICAgIHVybDogJy9ob21lJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmluZm8nLCB7XG4gICAgICAgIHVybDogJy9pbmZvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2luZm8vaW5mby5odG1sJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmNvbnRhY3QnLCB7XG4gICAgICAgIHVybDogJy9jb250YWN0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmxlZ2FsJywge1xuICAgICAgICB1cmw6ICcvbGVnYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbGVnYWwvbGVnYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMZWdhbEN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuYWJvdXQnLCB7XG5cdHVybDogJy9hYm91dCcsXG5cdHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9hYm91dC9hYm91dC5odG1sJyxcblx0Y29udHJvbGxlcjogJ0Fib3V0Q3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS51c2VyaW5mbycsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJpbmZvJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDdHJsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3VzZXIvdXNlci5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5jb3VudGllcycsIHtcbiAgICAgICAgdXJsOiAnL2NvdW50aWVzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2NvdW50aWVzL2NvdW50aWVzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ291bnRpZXNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtZW51LmFyZWFzJywge1xuICAgICAgICB1cmw6ICcvYXJlYXMnLFxuICAgICAgICBwYXJhbXM6IHsnaWQnOiBmYWxzZSwgJ2NvdW50eSc6IGZhbHNlLCAnc2VhcmNoJzogJyd9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYV9saXN0L2FyZWFfbGlzdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0FyZWFzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5jYXJkcycsIHtcbiAgICAgICAgdXJsOiAnL2NhcmRzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3VzZXJfY2FyZHMvdXNlcl9jYXJkcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDYXJkc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuZmF2b3JpdGVzJywge1xuICAgICAgICB1cmw6ICcvZmF2b3JpdGVzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2Zhdm9yaXRlcy9mYXZvcml0ZXMuaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5maXNoZXMnLCB7XG4gICAgICAgIHVybDogJy9maXNoZXMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvZmlzaGVzL2Zpc2hlcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Zpc2hlc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21lbnUuZmlzaGRldGFpbCcsIHtcbiAgICAgICAgdXJsOiAnL2Zpc2hkZXRhaWwvOmlkJyxcbiAgICAgICAgcGFyYW1zOiB7J2lkJzogZmFsc2UsICdmaXNoJzogZmFsc2V9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvZmlzaF9kZXRhaWwvZmlzaF9kZXRhaWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGaXNoRGV0YWlsQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS50ZWNobmlxdWVzJywge1xuICAgICAgICB1cmw6ICcvdGVjaG5pcXVlcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy90ZWNobmlxdWVzL3RlY2huaXF1ZXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUZWNobmlxdWVzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS50ZWNobmlxdWVkZXRhaWwnLCB7XG4gICAgICAgIHVybDogJy90ZWNobmlxdWVkZXRhaWwvOmlkJyxcbiAgICAgICAgcGFyYW1zOiB7J2lkJzogZmFsc2UsICd0ZWNoJzogZmFsc2V9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvdGVjaG5pcXVlX2RldGFpbC90ZWNobmlxdWVfZGV0YWlsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVGVjaG5pcXVlRGV0YWlsQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWVudS5yZXBvcnQnLCB7XG4gICAgICAgIHVybDogJy9yZXBvcnQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0L3JlcG9ydC5odG1sJ1xuICAgIH0pXG5cbiAgICAuc3RhdGUoJ2FyZWFkZXRhaWwyJywge1xuICAgICAgICBhYnN0cmFjdDp0cnVlLFxuICAgICAgICB1cmw6ICcvYXJlYWRldGFpbC86aWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYTIvYXJlYS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0FyZWEyQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnYXJlYWRldGFpbDIuaW5mbycsIHtcbiAgICAgICAgdXJsOiAnL2luZm8nLFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2luZm8nOiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FyZWFEZXRhaWxDdHJsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXJlYS9hcmVhLmh0bWwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXJlYWRldGFpbDIuZmlzaGluZm8nLCB7XG4gICAgICAgIHVybDogJy9maXNoaW5mbycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnZmlzaGluZm8nOiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FyZWFGaXNoSW5mb0N0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9hcmVhX2Zpc2gvYXJlYV9maXNoLmh0bWwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXJlYWRldGFpbDIuY2FyZHMnLCB7XG4gICAgICAgIHVybDogJy9jYXJkcycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY2FyZHMnOiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FyZWFEZXRhaWxDYXJkQ3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2FyZWFfY2FyZHMvYXJlYV9jYXJkcy5odG1sJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnLCBbXSk7XG5hbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmRpcmVjdGl2ZXMnLCBbXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQWJvdXRDdHJsJywgWyckc2NvcGUnLCckY29yZG92YUFwcFZlcnNpb24nLCAnJGlvbmljUGxhdGZvcm0nLCAnVXBkYXRlJywgZnVuY3Rpb24oJHNjb3BlLCAkY29yZG92YUFwcFZlcnNpb24sICRpb25pY1BsYXRmb3JtLCBVcGRhdGUpIHtcblx0JHNjb3BlLnZlcnNpb24gPSAkc2NvcGUuZGJEYXRlID0gJ09rXFx1MDBFNG50JztcbiAgICAkc2NvcGUuZGJEYXRlID0gVXBkYXRlLmxhc3RfdXBkYXRlKCk7XG5cblx0JGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG5cdCAgICBpZiAod2luZG93LmNvcmRvdmEpIHtcblx0XHQkY29yZG92YUFwcFZlcnNpb24uZ2V0QXBwVmVyc2lvbigpLnRoZW4oZnVuY3Rpb24odmVyc2lvbikge1xuXHRcdCAgICBjb25zb2xlLmxvZyh2ZXJzaW9uKTtcblx0XHQgICAgJHNjb3BlLnZlcnNpb24gPSB2ZXJzaW9uO1xuXHRcdH0pO1xuXHQgICAgfVxuXHR9KTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0FyZWFEZXRhaWxDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICdEQicsXG4gICAgJyRpb25pY1NsaWRlQm94RGVsZWdhdGUnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEQiwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSkge1xuICAgICAgICAkc2NvcGUuaW1hZ2VfZW5kcG9pbnQgPSAnaHR0cDovL3d3dy5pZmlza2Uuc2UnO1xuICAgICAgICBEQi5nZXRBcmVhKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgJHNjb3BlLmltYWdlcyA9IGFyZWEuaW1hZ2VzO1xuXG4gICAgICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgJHNjb3BlLmFyZWEgPSBhcmVhO1xuXG4gICAgICAgICAgICBEQi5nZXRPcmdhbml6YXRpb24oYXJlYS5vcmdpZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICRzY29wZS5vcmcgPSBvcmc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0FyZWEyQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGlvbmljSGlzdG9yeScsXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckaW9uaWNWaWV3U3dpdGNoZXInLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGlvbmljSGlzdG9yeSwgbG9jYWxTdG9yYWdlLCAkcm9vdFNjb3BlLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZVBhcmFtcykge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XG4gICAgJHNjb3BlLnRhYnNCYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIElmIHRoZSBjdXJyZW50IHZpZXcgaXMgYXQgdGhlIHRvcCBvZiBpdHMgaGlzdG9yeSBzdGFja1xuICAgICAgICBpZighJGlvbmljSGlzdG9yeS52aWV3SGlzdG9yeSgpLmN1cnJlbnRWaWV3LmluZGV4KSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFN3aXRjaCB0byB0aGUgaG9tZSBoaXN0b3J5IHN0YWNrXG4gICAgICAgICAgICAgKiBTZWUgJGlvbmljSGlzdG9yeSBzb3VyY2UgZm9yIHRoZSBldmVuIGhhbmRsZXIgdXNlZFxuICAgICAgICAgICAgICogU2VlIGhvbWVfY29udHJvbGxlci5qcyBmb3IgdGhlIGhpc3RvcnlJZCB1c2VkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGVtaXQoJyRpb25pY0hpc3RvcnkuY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGhpc3RvcnlJZDogbG9jYWxTdG9yYWdlLmdldCgnaG9tZUhpc3RvcnlJZCcpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERlZmF1bHQgYmFjayBhY3Rpb25cbiAgICAgICAgICAgICRyb290U2NvcGUuJGlvbmljR29CYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignQXJlYURldGFpbENhcmRDdHJsJywgWyckc2NvcGUnLCAnREInLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY01vZGFsJywgJ2xvY2FsU3RvcmFnZScsIGZ1bmN0aW9uKCRzY29wZSwgREIsICRzdGF0ZVBhcmFtcywgJGlvbmljTW9kYWwsIGxvY2FsU3RvcmFnZSkge1xuICAgICRzY29wZS5zbXN0ZXJtcyA9IGxvY2FsU3RvcmFnZS5nZXQoJ3Ntc190ZXJtcycpO1xuICAgICRzY29wZS5wcmVkaWNhdGUgPSBcInNvXCI7XG4gICAgREIuZ2V0UHJvZHVjdHNCeUFyZWEoJHN0YXRlUGFyYW1zLmlkKVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcblxuICAgIC8vU01TLW1vZGFsXG5cbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2NvbXBvbmVudHMvYXJlYV9jYXJkcy9tb2RhbC5odG1sJywge1xuICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgICAgICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSBwcm9kdWN0O1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG4gICAgICAgICRzY29wZS5ydWxlc19tb2RhbC5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zaG93aW5ndGVybXMgPSBmYWxzZTtcbiAgICAkc2NvcGUuc2hvd1Rlcm1zID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICRzY29wZS5zaG93aW5ndGVybXMgPSAhJHNjb3BlLnNob3dpbmd0ZXJtcztcbiAgICB9O1xuXG4gICAgLy9SdWxlcyBtb2RhbFxuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgnY29tcG9uZW50cy9hcmVhX2NhcmRzL3J1bGVzX21vZGFsLmh0bWwnLCB7XG4gICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAgIH0pLnRoZW4oZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgJHNjb3BlLnJ1bGVzX21vZGFsID0gbW9kYWw7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUub3BlblJ1bGVzTW9kYWwgPSBmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgICRzY29wZS5ydWxlc19tb2RhbC5zaG93KCk7XG4gICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNsb3NlUnVsZXNNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUucnVsZXNfbW9kYWwuaGlkZSgpO1xuICAgIH07XG5cbn1dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignQXJlYUZpc2hJbmZvQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdEQicsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEQikge1xuICAgICRzY29wZS5zb3J0b3JkZXIgPSAnLWFtb3VudCc7XG4gICAgJHNjb3BlLmltYWdlX2VuZHBvaW50ID0gJ2h0dHBzOi8vd3d3LmlmaXNrZS5zZS8nO1xuICAgIERCLmdldEFyZWFGaXNoZXMoJHN0YXRlUGFyYW1zLmlkKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZpc2hlcykge1xuICAgICAgICAkc2NvcGUuZmlzaGVzID0gZmlzaGVzO1xuICAgICAgICBjb25zb2xlLmxvZyhmaXNoZXMpO1xuICAgIH0pO1xuICAgIERCLmdldEFyZWEoJHN0YXRlUGFyYW1zLmlkKVxuICAgIC50aGVuKGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgJHNjb3BlLmFyZWEgPSBhcmVhO1xuXG4gICAgICAgIERCLmdldE9yZ2FuaXphdGlvbihhcmVhLm9yZ2lkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICRzY29wZS5vcmcgPSBvcmc7XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignQXJlYXNDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1Njcm9sbERlbGVnYXRlJyAsJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1Njcm9sbERlbGVnYXRlICxEQikge1xuXG4gICAgJHNjb3BlLnNlYXJjaCA9IHsnJCc6ICRzdGF0ZVBhcmFtcy5zZWFyY2h9O1xuICAgICRzY29wZS5xdWVyeUJ5ID0gJyQnO1xuICAgICRzY29wZS5jb3VudHkgPSAkc3RhdGVQYXJhbXMuY291bnR5O1xuICAgIERCLnNlYXJjaCgnJywgJHN0YXRlUGFyYW1zLmlkKVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICRzY29wZS5hcmVhcyA9IGRhdGE7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNsZWFyU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vdG9kbzogY2xlYXIgc2VhcmNoIGZpZWxkXG4gICAgfTtcbiAgICAkc2NvcGUuc2Nyb2xsVG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgIH07XG5cbn1dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignQ29udGFjdEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnbG9jYWxTdG9yYWdlJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIGxvY2FsU3RvcmFnZSkge1xuICAgICAgICAkc2NvcGUuY29udGFjdEluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0KCdjb250YWN0SW5mbycpO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignQ291bnRpZXNDdHJsJywgWyckc2NvcGUnLCAnREInLCBmdW5jdGlvbigkc2NvcGUsIERCKSB7XG4gICAgREIuZ2V0Q291bnRpZXMoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLmNvdW50aWVzID0gZGF0YTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0Zpc2hEZXRhaWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIERCKSB7XG4gICAgJHNjb3BlLmZpc2ggPSAkc3RhdGVQYXJhbXMuZmlzaDtcbiAgICAkc2NvcGUuaW1hZ2VfZW5kcG9pbnQgPSAnaHR0cDovL3d3dy5pZmlza2Uuc2UnO1xuICAgIGlmKCEkc2NvcGUuZmlzaCkge1xuICAgICAgICBEQi5nZXRGaXNoKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgJHNjb3BlLmZpc2ggPSBkYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5maXNoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmZpc2gpO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignRmlzaGVzQ3RybCcsIFsnJHNjb3BlJywgJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCBEQikge1xuICAgICRzY29wZS5zb3J0b3JkZXIgPSAnc28nO1xuICAgICRzY29wZS5pbWFnZV9lbmRwb2ludCA9ICdodHRwOi8vd3d3LmlmaXNrZS5zZSc7XG4gICAgREIuZ2V0RmlzaGVzKClcbiAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5maXNoZXMgPSBkYXRhO1xuICAgICAgICAkc2NvcGUuZGVmYXVsdF9pbWcgPSBkYXRhWzBdLmltZztcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UuY29udHJvbGxlcnMnKVxuLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknLCAnbG9jYWxTdG9yYWdlJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRpb25pY0hpc3RvcnksIGxvY2FsU3RvcmFnZSkge1xuXG4gICAgLy8gQ3VycmVudCBoaXN0b3J5IHN0YWNrIElkLiBTZWUgYXJlYV9jb250cm9sbGVyIGZvciB1c2FnZS5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0KCdob21lSGlzdG9yeUlkJywgJGlvbmljSGlzdG9yeS5jdXJyZW50SGlzdG9yeUlkKCkpO1xuXG4gICAgJHNjb3BlLm15RnVuYyA9IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICBpZigkZXZlbnQua2V5Q29kZSA9PSAxMyAmJiAhJGV2ZW50LnNoaWZ0S2V5KSB7IC8vaWYgZW50ZXIta2V5XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuYXJlYXMnLCB7c2VhcmNoOiAkZXZlbnQuc3JjRWxlbWVudC52YWx1ZX0pO1xuICAgICAgICB9XG5cbiAgICB9O1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignTGVnYWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ2xvY2FsU3RvcmFnZScsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBsb2NhbFN0b3JhZ2UpIHtcbiAgICAkc2NvcGUudG9zID0gbG9jYWxTdG9yYWdlLmdldCgndG9zJyk7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnVXBkYXRlJywgJyRpb25pY0xvYWRpbmcnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVXBkYXRlLCAkaW9uaWNMb2FkaW5nKSB7XG4gICAgLy8kc2NvcGUudXNlciA9IHt9O1xuICAgICRzY29wZS5zaWduSW4gPSBmdW5jdGlvbihsb2dpbkZvcm0pIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KCk7XG5cbiAgICAgICAgVXBkYXRlLnVzZXJfbG9naW4obG9naW5Gb3JtLnVzZXJuYW1lLiR2aWV3VmFsdWUsIGxvZ2luRm9ybS5wYXNzd29yZC4kdmlld1ZhbHVlKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgIGxvZ2luRm9ybS4kc2V0VmFsaWRpdHkoXCJsb2dpbkVycm9yXCIsIHRydWUpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LmhvbWUnKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgbG9naW5Gb3JtLiRzZXRWYWxpZGl0eShcImxvZ2luRXJyb3JcIiwgZmFsc2UpO1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyb3IucmVzcG9uc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdNZW51Q3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJGlvbmljUG9wb3ZlcicsXG4gICAgJ3Nlc3Npb25EYXRhJyxcbiAgICAnVXBkYXRlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJGlvbmljUG9wb3Zlciwgc2Vzc2lvbkRhdGEsIFVwZGF0ZSkge1xuXG4gICAgJHNjb3BlLnNlc3Npb25EYXRhID0gc2Vzc2lvbkRhdGE7XG5cbiAgICAkaW9uaWNQb3BvdmVyLmZyb21UZW1wbGF0ZVVybCgnY29tcG9uZW50cy9tZW51L3BvcG92ZXIuaHRtbCcsIHtcbiAgICAgICAgc2NvcGU6ICRzY29wZVxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocG9wb3Zlcikge1xuICAgICAgICAkc2NvcGUucG9wb3ZlciA9IHBvcG92ZXI7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUudXNlcmluZm8gPSBmdW5jdGlvbigpIHtcblx0JHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuXHQkc3RhdGUuZ28oJ21lbnUudXNlcmluZm8nKTtcbiAgICB9O1xuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcblx0JHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuXHRVcGRhdGUudXNlcl9sb2dvdXQoKTtcblxuXHQkc3RhdGUuZ28oJ3N0YXJ0LmxvZ2luJyk7XG4gICAgfTtcbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpIHtcblx0JHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuXHQkc3RhdGUuZ28oJ3N0YXJ0LmxvZ2luJyk7XG4gICAgfTtcbiAgICAkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHtcblx0JHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuXHQkc3RhdGUuZ28oJ3N0YXJ0LnJlZ2lzdGVyLmFjY291bnRfZGV0YWlscycpO1xuICAgIH07XG5cbiAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFVwZGF0ZS5mb3JjZWRVcGRhdGUoKTtcbiAgICB9O1xuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRpb25pY0xvYWRpbmcnLCAnQVBJJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRpb25pY0xvYWRpbmcsIEFQSSkge1xuXHRcblx0dmFyIHVzZXJuYW1lLCBwYXNzd29yZCwgcGhvbmU7XG5cdFxuXHQkc2NvcGUuYWNjb3VudERldGFpbHMgPSBmdW5jdGlvbihmb3JtKSB7XG5cdCAgICB1c2VybmFtZSA9IGZvcm0udXNlcm5hbWUuJHZpZXdWYWx1ZTtcblx0ICAgIHBhc3N3b3JkID0gZm9ybS5wYXNzd29yZC4kdmlld1ZhbHVlO1xuXHQgICAgJHN0YXRlLmdvKCdeLnVzZXJEZXRhaWxzJyk7XG5cdH07XG5cblx0JHNjb3BlLnVzZXJEZXRhaWxzID0gZnVuY3Rpb24oZm9ybSkge1xuXHQgICAgJGlvbmljTG9hZGluZy5zaG93KCk7XG5cblx0ICAgIHZhciBmdWxsbmFtZSA9IGZvcm0uZnVsbG5hbWUuJHZpZXdWYWx1ZTtcblx0ICAgIHZhciBlbWFpbCA9IGZvcm0uZW1haWwuJHZpZXdWYWx1ZTtcblx0ICAgIHBob25lID0gJHNjb3BlLnBob25lID0gZm9ybS5waG9uZS4kdmlld1ZhbHVlO1xuXHQgICAgXG5cdCAgICBBUEkudXNlcl9yZWdpc3Rlcih1c2VybmFtZSwgZnVsbG5hbWUsIHBhc3N3b3JkLCBlbWFpbCwgcGhvbmUpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZGF0YSkgeyBcblx0XHQgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG5cdFx0ICAgICRzdGF0ZS5nbygnXi52ZXJpZnknKTtcblx0XHR9LCBmdW5jdGlvbihlcnJvcikge1xuXHRcdCAgICAvLyBUb0RvOiBkaXNwbGF5IGVycm9yXG5cdFx0ICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS52ZXJpZnkgPSBmdW5jdGlvbihmb3JtKSB7XG5cdCAgICAkaW9uaWNMb2FkaW5nLnNob3coKTtcblxuXHQgICAgdmFyIHZlcmNvZGUgPSBmb3JtLnZlcmNvZGU7XG5cdCAgICBcblx0ICAgIEFQSS51c2VyX2NvbmZpcm0odXNlcm5hbWUsIHZlcmNvZGUuJHZpZXdWYWx1ZSlcblx0XHQudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0ICAgICRzdGF0ZS5nbygnc3RhcnQubG9naW4nKTtcblx0XHQgICAgdmVyY29kZS4kc2V0VmFsaWRpdHkoXCJ2ZXJpZmllZFwiLCB0cnVlKTtcblx0XHQgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG5cblx0XHR9LCBmdW5jdGlvbihlcnJvcikge1xuXHRcdCAgICB2ZXJjb2RlLiRzZXRWYWxpZGl0eShcInZlcmlmaWVkXCIsIGZhbHNlKTtcblx0XHQgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG5cdFx0fSk7XG5cdH07XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5jb250cm9sbGVycycpXG4uY29udHJvbGxlcignVGVjaG5pcXVlRGV0YWlsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdEQicsICckaW9uaWNTbGlkZUJveERlbGVnYXRlJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIERCLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlKSB7XG4gICAgJHNjb3BlLmltYWdlX2VuZHBvaW50ID0gJ2h0dHA6Ly93d3cuaWZpc2tlLnNlJztcbiAgICAkc2NvcGUudGVjaCA9ICRzdGF0ZVBhcmFtcy50ZWNoO1xuICAgICRzY29wZS5pbWFnZXMgPSBbXTtcblxuICAgIGlmKCEkc2NvcGUudGVjaCkge1xuICAgICAgICBEQi5nZXRUZWNobmlxdWUoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAkc2NvcGUuaW1hZ2VzID0gW2RhdGEuaW1nMSwgZGF0YS5pbWcyLCBkYXRhLmltZzNdLmZpbHRlcihmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhL1xcLyQvLnRlc3QoZWwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XG4gICAgICAgICAgICAkc2NvcGUudGVjaCA9IGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkYXRhID0gJHNjb3BlLnRlY2g7XG4gICAgICAgICRzY29wZS5pbWFnZXMgPSBbZGF0YS5pbWcxLCBkYXRhLmltZzIsIGRhdGEuaW1nM10uZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gIS9cXC8kLy50ZXN0KGVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS51cGRhdGUoKTtcbiAgICB9XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdUZWNobmlxdWVzQ3RybCcsIFsnJHNjb3BlJywgJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCBEQikge1xuICAgIERCLmdldFRlY2huaXF1ZXMoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICRzY29wZS50ZWNobmlxdWVzID0gZGF0YTtcbiAgICB9KTtcbiAgICAkc2NvcGUuaW1hZ2VfZW5kcG9pbnQgPSAnaHR0cDovL3d3dy5pZmlza2Uuc2UnO1xuICAgICRzY29wZS5zb3J0b3JkZXIgPSAnc28nO1xuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdVc2VyQ3RybCcsIFsnJHNjb3BlJywgJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCBEQikge1xuICAgIERCLmdldFVzZXJJbmZvKClcbiAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICB9KTtcbiAgICBEQi5nZXRVc2VyTnVtYmVycygpXG4gICAgLnRoZW4oZnVuY3Rpb24obnVtYmVycykge1xuICAgICAgICAkc2NvcGUubnVtYmVycyA9IG51bWJlcnM7XG4gICAgfSk7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmNvbnRyb2xsZXJzJylcbi5jb250cm9sbGVyKCdVc2VyQ2FyZHNDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ0RCJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIERCKSB7XG4gICAgJHNjb3BlLnByZWQgPSAnLXRvJztcbiAgICAkc2NvcGUubm93ID0gRGF0ZS5ub3coKTtcbiAgICBEQi5nZXRVc2VyUHJvZHVjdHMoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn1dKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyLCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmFwaScsIFsnaWZpc2tlLnV0aWxzJ10pXG4gICAgLnByb3ZpZGVyKCdBUEknLCBmdW5jdGlvbiBBUElQcm92aWRlcigpIHtcblxuICAgICAgICB0aGlzLmJhc2VfdXJsID0gJ2h0dHBzOi8vd3d3LmlmaXNrZS5zZS9hcGkvdjIvYXBpLnBocCc7XG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gWyckaHR0cCcsICdzZXNzaW9uRGF0YScsICdsb2NhbFN0b3JhZ2UnLCAnJHEnLCBmdW5jdGlvbigkaHR0cCwgc2Vzc2lvbkRhdGEsIGxvY2FsU3RvcmFnZSwgJHEpIHtcbiAgICAgICAgICAgIHZhciBiYXNlX3VybCA9IHRoaXMuYmFzZV91cmw7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIyBhcGlfY2FsbCAjXG4gICAgICAgICAgICAgKiBoYW5kbGVzIGh0dHAgcmVxdWVzdHNcbiAgICAgICAgICAgICAqIHJldHVybnMgYSAkaHR0cCBvYmplY3QgZm9yIHRoZSByZXF1ZXN0ZWQgYXBpIGNhbGxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGFwaV9jYWxsID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAkaHR0cChcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6J2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBiYXNlX3VybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGFuZ3VsYXIuZXh0ZW5kKHBhcmFtcywgeydrZXknOiAnMDEyMzQ1Njc4OWFiY2RlZid9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiA1MDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLy8gVG9EbzogUHJvcGVyIGxvZ2dpbmdcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5zdGF0dXMgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignUmVxdWVzdCB0aW1lb3V0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAjIHNlc3Npb25fYXBpX2NhbGwgI1xuICAgICAgICAgICAgICogd3JhcHBlciBmb3IgYXBpX2NhbGwgLSBpbnNlcnRzIHRoZSBzZXNzaW9uIHRva2VuIGludG8gcGFyYW1zXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBzZXNzaW9uX2FwaV9jYWxsID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlc3Npb24gPSBzZXNzaW9uRGF0YS50b2tlbjtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoYW5ndWxhci5leHRlbmQocGFyYW1zLCB7czogc2Vzc2lvbn0pKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZ2V0X211bmljaXBhbGl0aWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X211bmljaXBhbGl0aWVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2NvdW50aWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X2NvdW50aWVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9leGlzdHM6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ3VzZXJfZXhpc3RzJywgdXNlcm5hbWU6IHVzZXJuYW1lfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX3JlZ2lzdGVyOiBmdW5jdGlvbih1c2VybmFtZSwgZnVsbG5hbWUsIHBhc3N3b3JkLCBlbWFpbCwgcGhvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAndXNlcl9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxuYW1lOiBmdWxsbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX2NvbmZpcm06IGZ1bmN0aW9uKHVzZXJuYW1lLCBwaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAndXNlcl9jb25maXJtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGluOiBwaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcl9pbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlc3Npb25fYXBpX2NhbGwoe206ICd1c2VyX2luZm8nfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX2xvZ2luOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAndXNlcl9sb2dpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uRGF0YS5zZXRUb2tlbihkYXRhLmRhdGEucmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9uZWVkZWQgZm9yIGNoYWluaW5nIG9mIHByb21pc2VzLCBzaG91bGQgYmUgZG9uZSBzb21lIG90aGVyIHdheSBwZXJoYXBzP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VyX2xvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25fYXBpX2NhbGwoe206ICd1c2VyX2xvZ291dCd9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uRGF0YS5kZWxldGVUb2tlbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvZHVjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2Vzc2lvbl9hcGlfY2FsbCh7bTogJ3VzZXJfcHJvZHVjdHMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfZmlzaGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X2Zpc2hlcyd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF90ZWNobmlxdWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X3RlY2huaXF1ZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfYmFpdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfYmFpdHMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfb3JnYW5pemF0aW9uczogZnVuY3Rpb24ob3JnaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X29yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2lkOiBvcmdpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfb3JnX21vZGlmaWVkOiBmdW5jdGlvbihvcmdpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfb3JnX21vZGlmaWVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdpZDogb3JnaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2FyZWFzOiBmdW5jdGlvbihhcmVhaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X2FyZWFzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhaWQ6IGFyZWFpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfYXJlYXNfbW9kaWZpZWQ6IGZ1bmN0aW9uKGFyZWFpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG06ICdnZXRfYXJlYXNfbW9kaWZpZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFpZDogYXJlYWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9wcm9kdWN0czogZnVuY3Rpb24oYXJlYWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9wcm9kdWN0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYWlkOiBhcmVhaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X3J1bGVzOiBmdW5jdGlvbihydWxlaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X3J1bGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlaWQ6IHJ1bGVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfcGhvdG9zOiBmdW5jdGlvbihvcmdpZCwgYXJlYWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9waG90b3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2lkOiBvcmdpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhaWQ6IGFyZWFpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfbWFwX3BvaXM6IGZ1bmN0aW9uKG9yZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbTogJ2dldF9tYXBfcG9pcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnaWQ6IG9yZ2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9tYXBfcG9pX3R5cGVzIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9tYXBfcG9pX3R5cGVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X21hcF9wb2x5Z29uczogZnVuY3Rpb24ob3JnaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBtOiAnZ2V0X21hcF9wb2x5Z29ucycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnaWQ6IG9yZ2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZXJfZ2V0X2Zhdm9yaXRlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXNzaW9uX2FwaV9jYWxsKHttOiAndXNlcl9nZXRfZmF2b3JpdGVzJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X3Rlcm1zX29mX3NlcnZpY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfdGVybXNfb2Zfc2VydmljZSd9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldF9jb250YWN0X2luZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBpX2NhbGwoe206ICdnZXRfY29udGFjdF9pbmZvJ30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0X2VuZ2luZV9wb2xpY2llczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcGlfY2FsbCh7bTogJ2dldF9lbmdpbmVfcG9saWNpZXMnfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRfc21zX3Rlcm1zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwaV9jYWxsKHttOiAnZ2V0X3Ntc190ZXJtcyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XTtcbiAgICB9KTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyLCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnaWZpc2tlLmRiJywgW10pXG4gICAgLnByb3ZpZGVyKCdEQicsIGZ1bmN0aW9uIERCUHJvdmlkZXIoKSB7XG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gWyAnJGNvcmRvdmFTUUxpdGUnLCAnQVBJJywgJyRxJywgZnVuY3Rpb24oJGNvcmRvdmFTUUxpdGUsIEFQSSwgJHEpIHtcblxuXG4gICAgICAgICAgICB2YXIgZGI7XG4gICAgICAgICAgICBpZiAod2luZG93LnNxbGl0ZVBsdWdpbikge1xuICAgICAgICAgICAgICAgIGRiID0gJGNvcmRvdmFTUUxpdGUub3BlbkRCKCdmaXNrZWJhc2VuLmRiJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5vcGVuRGF0YWJhc2UpIHtcbiAgICAgICAgICAgICAgICBkYiA9IHdpbmRvdy5vcGVuRGF0YWJhc2UoJ2Zpc2tlYmFzZW4uZGInLCAnMS4wJywgJ2Zpc2tlYmFzZW4nLCAxMCoxMDI0KjEwMjQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTm90IHN1cHBvcnRlZCBvbiB0aGlzIGRldmljZSwgc29ycnknKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHZhciB0YWJsZURlZiA9IHtcbiAgICAgICAgICAgICAgICAnQXJlYSc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydvcmdpZCcsICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsna3cnLCAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ25vdGUnLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjMScsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjMicsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjMycsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtMScsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtMicsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtMycsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydsYXQnLCAgICdyZWFsJ10sXG4gICAgICAgICAgICAgICAgICAgIFsnbG5nJywgICAncmVhbCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3pvb20nLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydwbnQnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjYXInLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydlbmcnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydoY3AnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtYXAnLCAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnd3NjJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbW9kJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZCcsICAgICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnQXJlYV9GaXNoJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydhaWQnLCAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZmlkJywgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2Ftb3VudCcsICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjb21tZW50JywgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1Byb2R1Y3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsndDInLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydubycsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ltJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsncGYnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydhaScsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsncmknLCAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NoJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydwcmljZScsICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbW9kJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3NvJywgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydobCcsICAgICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnQ291bnR5JzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydzJywgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZCcsICAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ011bmljaXBhbGl0eSc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjSUQnLCAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyduYW1lJywgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdGaXNoJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbW9kJywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnc28nLCAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbWF4JywgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaWNvbicsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ltZycsICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpbicsICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZ2VvJywgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3NpemUnLCAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydsYXQnLCAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsncmVjJywgICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnUnVsZSc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3ZlcicsICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZCcsICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICd0ZXh0J11cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdVc2VyX1Byb2R1Y3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnSUQnLCAgICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2F0JywgICAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjb2RlJywgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZnInLCAgICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2Z1bGxuYW1lJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnb3QnLCAgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydyZWYxJywgICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsncmVmMicsICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3QnLCAgICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsndG8nLCAgICAgICAgJ2ludCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVXNlcl9JbmZvJzogW1xuICAgICAgICAgICAgICAgICAgICBbJ0lEJywgICAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd1c2VybmFtZScsICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2xvZ2dlZGluJywgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnSVAxJywgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydJUDInLCAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ25hbWUnLCAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZW1haWwnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjcmVhdGVkJywgICAndGV4dCddXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVXNlcl9OdW1iZXInOiBbXG4gICAgICAgICAgICAgICAgICAgIFsnbnVtYmVyJywgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1RlY2huaXF1ZSc6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWyd0JywgICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZCcsICAgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3NvJywgICAgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2RlJywgICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkYScsICAgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaWNvbicsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2ltZzEnLCAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydpbWcyJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsnaW1nMycsICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3lvdXR1YmUnLCAgJ3RleHQnXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ09yZ2FuaXphdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgWydJRCcsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsndCcsICAgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkJywgICAgICAndGV4dCddLFxuICAgICAgICAgICAgICAgICAgICBbJ2NwJywgICAgICd0ZXh0J10sXG4gICAgICAgICAgICAgICAgICAgIFsndXJsJywgICAgJ3RleHQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydjbycsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnbW9kJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ3ZhdCcsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydkcCcsICAgICAnaW50J10sXG4gICAgICAgICAgICAgICAgICAgIFsnZnZhJywgICAgJ2ludCddLFxuICAgICAgICAgICAgICAgICAgICBbJ29yZycsICAgICdpbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgWydtbCcsICAgICAnaW50J11cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgY3JlYXRlT2JqZWN0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciByZXR2YWwgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5yb3dzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHZhbC5wdXNoKGRhdGEucm93cy5pdGVtKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICAgICAgICAgIH07XG5cblxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHBvcHVsYXRlVGFibGU6IGZ1bmN0aW9uKHRhYmxlLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbiAoZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYi50cmFuc2FjdGlvbihmdW5jdGlvbih0eCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4LmV4ZWN1dGVTcWwoJ0RFTEVURSBGUk9NICcgKyB0YWJsZSArICc7Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpZCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaW5nbGVEYXRhID0gZGF0YVtpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnNlcnREYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFibGVEZWZbdGFibGVdLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnREYXRhLnB1c2goc2luZ2xlRGF0YVt0YWJsZURlZlt0YWJsZV1baV1bMF1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSU5TRVJUIElOVE8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnVkFMVUVTKD8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyw/Jy5yZXBlYXQoaW5zZXJ0RGF0YS5sZW5ndGgtMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKSddLmpvaW4oJyAnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHguZXhlY3V0ZVNxbChxdWVyeSwgaW5zZXJ0RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBjbGVhblRhYmxlOiBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24gKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGIudHJhbnNhY3Rpb24oZnVuY3Rpb24odHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eC5leGVjdXRlU3FsKCdERUxFVEUgRlJPTSAnICsgdGFibGUgKyAnOycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRHJvcHMgYWxsIHRhYmxlcyBpbiB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGNsZWFuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24gKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGIudHJhbnNhY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB0YWJsZSBpbiB0YWJsZURlZil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eC5leGVjdXRlU3FsKCdEUk9QIFRBQkxFIElGIEVYSVNUUyAnICsgdGFibGUgKyAnOycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZlZCBhbGwgdGFibGVzJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJbml0aWFsaWVzIHRoZSB0YWJsZXMgaW4gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBpbml0XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGIudHJhbnNhY3Rpb24oIGZ1bmN0aW9uICh0eCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdGFibGUgaW4gdGFibGVEZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJygnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiJyArIHRhYmxlRGVmW3RhYmxlXS5qb2luKCdfX19cIicpLnNwbGl0KCcsJykuam9pbignXCIgJykuc3BsaXQoJ19fXycpLmpvaW4oJywgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLCBQUklNQVJZIEtFWSgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiJyArIHRhYmxlRGVmW3RhYmxlXVswXVswXSArICdcIicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKSk7J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHguZXhlY3V0ZVNxbChxdWVyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG5cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdldHMgaW5mb3JtYXRpb24gYWJvdXQgYW4gYXJlYVxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0QXJlYVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRBcmVhOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBBcmVhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgaWQgPSA/J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksIFtpZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiggZnVuY3Rpb24gKGFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gY3JlYXRlT2JqZWN0KGFyZWEpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfcGhvdG9zKG9iamVjdC5vcmdpZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihpbWFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmltYWdlcyA9IGltYWdlcy5kYXRhLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0QXJlYUZpc2hlczogZnVuY3Rpb24oYWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcSggZnVuY3Rpb24gKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gQXJlYV9GaXNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSk9JTiBGaXNoIE9OIEFyZWFfRmlzaC5maWQgPSBGaXNoLklEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgQXJlYV9GaXNoLmFpZCA9ID8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSwgW2FpZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFNlYXJjaGVzIHRoZSBkYXRhYmFzZSB1c2luZyBhIHF1ZXJ5XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBUaGUgcXVlcnkgaXMgbWF0Y2hlZCB0byBhIG5hbWUgYW5kL29yIGtleXdvcmRcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHNlYXJjaFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hzdHJpbmdcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uKHNlYXJjaHN0cmluZywgY291bnR5X2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcSggZnVuY3Rpb24gKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZST00gQXJlYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIHQgTElLRSA/JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY291bnR5X2lkID8gJ0FORCBjMSA9ID8nOicnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnT1JERVIgQlkgdCdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnR5X2lkID8gWyclJyArIHNlYXJjaHN0cmluZyArICclJywgY291bnR5X2lkXTpbJyUnICsgc2VhcmNoc3RyaW5nICsgJyUnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogR2V0cyBpbmZvcm1hdGlvbiBhYm91dCBhIHByb2R1Y3RcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldFByb2R1Y3RcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHByb2R1Y3RfaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRQcm9kdWN0OiBmdW5jdGlvbihwcm9kdWN0X2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIERJU1RJTkNUIConLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIFByb2R1Y3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBJRCA9ID8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtwcm9kdWN0X2lkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogR2V0cyBhbGwgcHJvZHVjdHMgZnJvbSBhbiBhcmVhXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRQcm9kdWN0c0J5QXJlYVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gYXJlYV9pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldFByb2R1Y3RzQnlBcmVhOiBmdW5jdGlvbihhcmVhX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIERJU1RJTkNUIFByb2R1Y3QuKiwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSdWxlLnQgYXMgcnVsZV90LCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1J1bGUudmVyIGFzIHJ1bGVfdmVyLCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1J1bGUuZCBhcyBydWxlX2QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIFByb2R1Y3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdKT0lOIFJ1bGUgT04gUnVsZS5JRCA9IFByb2R1Y3QucmknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBhaSA9ID8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdPUkRFUiBCWSBzbydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgW2FyZWFfaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRDb3VudGllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIERJU1RJTkNUIENvdW50eS4qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRlJPTSBDb3VudHknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdKT0lOIEFyZWEgT04gQXJlYS5jMSA9IENvdW50eS5JRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ09SREVSIEJZIENvdW50eS50J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldFVzZXJQcm9kdWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUICogRlJPTSBVc2VyX1Byb2R1Y3QnXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0RmlzaGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKiBGUk9NIEZpc2gnXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0RmlzaDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKiBGUk9NIEZpc2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdXSEVSRSBpZCA9ID8nXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSwgW2lkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0VGVjaG5pcXVlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUICogRlJPTSBUZWNobmlxdWUnXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFRlY2huaXF1ZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKGZ1bGZpbGwsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTRUxFQ1QgKiBGUk9NIFRlY2huaXF1ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1dIRVJFIElEID0gPydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpLCBbaWRdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoY3JlYXRlT2JqZWN0KGRhdGEpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0T3JnYW5pemF0aW9uOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NFTEVDVCAqIEZST00gT3JnYW5pemF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnV0hFUkUgSUQgPSA/J1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyksIFtpZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QoZGF0YSlbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRVc2VySW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIConLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIFVzZXJfSW5mbydcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChjcmVhdGVPYmplY3QodXNlcilbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRVc2VyTnVtYmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihmdWxmaWxsLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU0VMRUNUIConLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGUk9NIFVzZXJfTnVtYmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiggZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGNyZWF0ZU9iamVjdChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dO1xuICAgIH0pO1xufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5maWx0ZXJzJywgW10pXG4uZmlsdGVyKCdub2JycycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKDxicj5cXHMqKSsvZywgJzxicj4nKTtcbiAgICB9O1xufSk7XG4iLCIoZnVuY3Rpb24oYW5ndWxhciwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS51cGRhdGUnLCBbJ2lmaXNrZS5hcGknLCAnaWZpc2tlLmRiJywgJ2lmaXNrZS51dGlscyddKVxuICAgIC5wcm92aWRlcignVXBkYXRlJywgZnVuY3Rpb24gVXBkYXRlUHJvdmlkZXIoKSB7XG5cblxuICAgICAgICB0aGlzLiRnZXQgPSBbXG4gICAgICAgICAgICAnQVBJJyxcbiAgICAgICAgICAgICdEQicsXG4gICAgICAgICAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAgICAgICAgICckcScsXG4gICAgICAgICAgICAnJGlvbmljTG9hZGluZycsXG4gICAgICAgICAgICAnc2Vzc2lvbkRhdGEnLFxuICAgICAgICAgICAgZnVuY3Rpb24oQVBJLCBEQiwgbG9jYWxTdG9yYWdlLCAkcSwgJGlvbmljTG9hZGluZywgc2Vzc2lvbkRhdGEpIHtcblxuICAgICAgICAgICAgICAgIHZhciBMQVNUX1VQREFURSA9ICdsYXN0X3VwZGF0ZSc7XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9wdWxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X2FyZWFzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlzaEFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGRhdGEuZGF0YS5yZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlzaGVzID0gZGF0YS5kYXRhLnJlc3BvbnNlW2tleV0uZmlzaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBmaXNoS2V5IGluIGZpc2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlzaEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSUQnOiBrZXkrJ18nK2Zpc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlkOiBmaXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpZDoga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudDogZmlzaGVzW2Zpc2hLZXldWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6IGZpc2hlc1tmaXNoS2V5XVsxXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERCLnBvcHVsYXRlVGFibGUoJ0FyZWEnLCBkYXRhLmRhdGEucmVzcG9uc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQi5wb3B1bGF0ZVRhYmxlKCdBcmVhX0Zpc2gnLCBmaXNoQXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgQXJlYScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfcHJvZHVjdHMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdQcm9kdWN0JywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIFByb2R1Y3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X2NvdW50aWVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnQ291bnR5JywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIENvdW50eScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfbXVuaWNpcGFsaXRpZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdNdW5pY2lwYWxpdHknLCBkYXRhLmRhdGEucmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgTXVuaWNpcGFsaXR5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF9maXNoZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5wb3B1bGF0ZVRhYmxlKCdGaXNoJywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIEZpc2gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X3J1bGVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnUnVsZScsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBSdWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBJLmdldF90ZWNobmlxdWVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIucG9wdWxhdGVUYWJsZSgnVGVjaG5pcXVlJywgZGF0YS5kYXRhLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIFRlY2huaXF1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfb3JnYW5pemF0aW9ucygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ09yZ2FuaXphdGlvbicsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBPcmdhbml6YXRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBwb3B1bGF0ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkudXNlcl9wcm9kdWN0cygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCLnBvcHVsYXRlVGFibGUoJ1VzZXJfUHJvZHVjdCcsIGRhdGEuZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBVc2VyX1Byb2R1Y3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkudXNlcl9pbmZvKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtYmVycyA9IGRhdGEuZGF0YS5yZXNwb25zZS5udW1iZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1BcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbnVtYmVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1BcnIucHVzaCh7J251bWJlcic6IG51bWJlcnNbaV19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERCLnBvcHVsYXRlVGFibGUoJ1VzZXJfSW5mbycsIFtkYXRhLmRhdGEucmVzcG9uc2VdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3B1bGF0ZWQgVXNlcl9JbmZvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5kYXRhLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQi5wb3B1bGF0ZVRhYmxlKCdVc2VyX051bWJlcicsIG51bUFycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIFVzZXJfTnVtYmVycycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBjbGVhblVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICBEQi5jbGVhblRhYmxlKCdVc2VyX1Byb2R1Y3QnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERCLmNsZWFuVGFibGUoJ1VzZXJfTnVtYmVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBEQi5jbGVhblRhYmxlKCdVc2VyX0luZm8nKVxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZW1vdmVkIHVzZXIgaW5mbyBmcm9tIGRhdGFiYXNlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCByZW1vdmUgdXNlciBkYXRhIGZyb20gZGF0YWJhc2UhJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZUZ1bmMgPSBmdW5jdGlvbihmb3JjZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFVwZGF0ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmb3JjZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGUgPSBsb2NhbFN0b3JhZ2UuZ2V0KExBU1RfVVBEQVRFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhV2VlayA9IDEwMDAqMzYwMCoyNCo3O1xuICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50VGltZSAtIGxhc3RVcGRhdGUgPiBhV2Vlaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgREIuaW5pdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6ZWQgREIgc3lzdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2Vzc2lvbkRhdGEudG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZVVzZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvcHVsYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUG9wdWxhdGVkIGFsbCB0aGUgdGhpbmdzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldChMQVNUX1VQREFURSwgY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyLmVycm9yX2NvZGUgPT09IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXV0aGVudGljYXRpb24gZmFpbHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBTaG93IHRvIHVzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5Vc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFQSS51c2VyX2xvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR290IGFuIGVycm9yLCB3aWxsIHRyeSB0byByZWNyZWF0ZSBhbGwgdGFibGVzOiAnLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEQi5jbGVhbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREIuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9wdWxhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BvcHVsYXRlZCBhbGwgdGhlIHRoaW5ncycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldChMQVNUX1VQREFURSwgY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N0aWxsIGVycm9yLCBoYW5kbGUgaXQhJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQSS5nZXRfdGVybXNfb2Zfc2VydmljZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldCgndG9zJyxkYXRhLmRhdGEucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X3Ntc190ZXJtcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbih0ZXJtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXQoJ3Ntc190ZXJtcycsIHRlcm1zLmRhdGEucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkuZ2V0X2NvbnRhY3RfaW5mbygpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldCgnY29udGFjdEluZm8nLCBkYXRhLmRhdGEucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKHNlc3Npb25EYXRhLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEQi5pbml0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbml0aWFsaXplZCBEQiBzeXN0ZW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzZXNzaW9uRGF0YS50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZVVzZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub191cGRhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVGdW5jKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgZm9yY2VkVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgdXNlcl9sb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5Vc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBUEkudXNlcl9sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9sb2dpbjogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQVBJLnVzZXJfbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRnVuYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0KExBU1RfVVBEQVRFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XTtcbiAgICB9KTtcbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdpZmlza2UudXRpbHMnLCBbXSlcblxuLmZhY3RvcnkoJ2xvY2FsU3RvcmFnZScsIFsnJHdpbmRvdycsIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgfTtcbn1dKVxuLnNlcnZpY2UoJ3Nlc3Npb25EYXRhJywgWydsb2NhbFN0b3JhZ2UnLCBmdW5jdGlvbihsb2NhbFN0b3JhZ2UpIHtcbiAgICB0aGlzLnRva2VuID0gbG9jYWxTdG9yYWdlLmdldCgnc2Vzc2lvbicpO1xuXG4gICAgdGhpcy5zZXRUb2tlbiA9IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldCgnc2Vzc2lvbicsIHQpO1xuICAgICAgICB0aGlzLnRva2VuID0gdDtcbiAgICAgICAgY29uc29sZS5sb2coJ3Rva2VuIHNldCcpO1xuICAgIH07XG4gICAgdGhpcy5kZWxldGVUb2tlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlKCdzZXNzaW9uJyk7XG4gICAgICAgIHRoaXMudG9rZW4gPSBudWxsO1xuICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gdW5zZXQnKTtcbiAgICB9O1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ25nQ29yZG92YVNtcycsIFtdKVxuLmRpcmVjdGl2ZSgnbmdDb3Jkb3ZhU21zJywgWyckY29yZG92YVNtcycsICckaW9uaWNQb3B1cCcsIGZ1bmN0aW9uKCRjb3Jkb3ZhU21zLCAkaW9uaWNQb3B1cCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBhdHRycykge1xuICAgICAgICAgICAgZWwub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5wcm9tcHQoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Nrcml2IGluIGRpdHQgbmFtbicsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VHlwZTogJ3RleHQnXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gJ0ZJU0tBICcgKyBhdHRycy5uZ0NvcmRvdmFTbXMgKyAnICcgKyBuYW1lO1xuICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNtcy5zZW5kKCc3MjQ1NicsIG1lc3NhZ2UsICdJTlRFTlQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWNjdWVzcycpO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2lmaXNrZS5kaXJlY3RpdmVzJylcbiAgICAuZGlyZWN0aXZlKCdpZmlza2VJbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHQgICAgcmVzdHJpY3Q6ICdFJyxcblx0ICAgIHRyYW5zY2x1ZGU6IHRydWUsXG5cblx0ICAgIHNjb3BlOiB7XG5cdFx0bmFtZTogJ0AnLFxuXHRcdGlkOiAnQCcsXG5cdFx0bGFiZWw6ICdAJyxcblx0XHRwbGFjZWhvbGRlcjogJ0AnLFxuXHRcdHR5cGU6ICdAJyxcblx0XHRuZ1BhdHRlcm46ICdAJyxcblx0XHRuZ01vZGVsOiAnPT8nXG5cblx0ICAgIH0sXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2RpcmVjdGl2ZXMvaW5wdXRfZmllbGQvaWZpc2tlX2lucHV0Lmh0bWwnLFxuXHQgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG5cdFx0JHNjb3BlLmlkID0gJHNjb3BlLmlkIHx8ICRzY29wZS5uYW1lO1xuXHRcdCRzY29wZS50eXBlID0gJHNjb3BlLnR5cGUgfHwgJ3RleHQnO1xuXHQgICAgfVxuXHR9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdzeXN0ZW1Ccm93c2VyJywgW10pXG4uZGlyZWN0aXZlKCdzeXN0ZW1Ccm93c2VyJywgWyckY29yZG92YUluQXBwQnJvd3NlcicsIGZ1bmN0aW9uKCRjb3Jkb3ZhSW5BcHBCcm93c2VyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWwsIGF0dHJzKSB7XG4gICAgICAgICAgICBlbC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgJGNvcmRvdmFJbkFwcEJyb3dzZXIub3BlbihlbFswXS5ocmVmLCAnX3N5c3RlbScpO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1dKVxuLmRpcmVjdGl2ZSgnZ2xvYmFsU3lzdGVtQnJvd3NlcicsIFsnJGNvcmRvdmFJbkFwcEJyb3dzZXInLCBmdW5jdGlvbigkY29yZG92YUluQXBwQnJvd3Nlcikge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBhdHRycykge1xuICAgICAgICAgICAgZWwub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC5ocmVmICYmIGUudGFyZ2V0Lmhvc3QgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0KSB7XG4gICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhSW5BcHBCcm93c2VyLm9wZW4oZS50YXJnZXQuaHJlZiwgJ19zeXN0ZW0nKTtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcbiIsIi8qYW5ndWxhci5tb2R1bGUoJ3RyZWVUYWJzJywgWydpb25pYyddKVxuICAgIC5kaXJlY3RpdmUoJ2lvblRhYnMnLCBbJyRyb290U2NvcGUnLCckc3RhdGUnLCckaW9uaWNIaXN0b3J5JywnJGlvbmljVmlld1N3aXRjaGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5LCAkaW9uaWNWaWV3U3dpdGNoZXIpIHtcblx0ZnVuY3Rpb24gZ2V0VGFiUm9vdFN0YXRlKHN0YXRlKSB7XG5cdCAgICB2YXIgaXNSb290U3RhdGU7XG5cblx0ICAgIGlmIChzdGF0ZS5wYXJlbnQuc2VsZi5hYnN0cmFjdCkge1xuXHRcdGlzUm9vdFN0YXRlID0gc3RhdGUuc2VsZi5uYW1lO1xuXHQgICAgfSBlbHNlIHtcblx0XHRpc1Jvb3RTdGF0ZSA9IGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gIGlzUm9vdFN0YXRlIHx8IGdldFRhYlJvb3RTdGF0ZShzdGF0ZS5wYXJlbnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNUYWJSb290U3RhdGUoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS5zZWxmLm5hbWUgPT09IGdldFRhYlJvb3RTdGF0ZShzdGF0ZSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHQgICAgcmVzdHJpY3Q6ICdFQScsXG5cdCAgICByZXF1aXJlOiAnaW9uVGFicycsXG5cdCAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0ciwgY3RybCkge1xuXHRcdGNvbnNvbGUubG9nKCdzOiAnLHNjb3BlKTtcblx0XHRjb25zb2xlLmxvZygnZTogJyxlbGVtZW50KTtcblx0XHRjb25zb2xlLmxvZygnYTogJyxhdHRyKTtcblx0XHRjb25zb2xlLmxvZygnYzogJyxjdHJsKTtcblx0XHR2YXIgc2VsZWN0VGFiID0gY3RybC5zZWxlY3Q7XG5cdFx0Y3RybC5zZWxlY3QgPSBmdW5jdGlvbih0YWIsIHNob3VsZEVtaXRFdmVudCkge1xuXHRcdCAgICB2YXIgc2VsZWN0ZWRUYWIgPSBjdHJsLnNlbGVjdGVkVGFiKCk7XG5cblx0XHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHNob3VsZEVtaXRFdmVudCA9ICEhKHRhYi5uYXZWaWV3TmFtZSB8fCB0YWIudWlTcmVmKTtcblx0XHQgICAgfVxuXG5cdFx0ICAgIGlmIChzZWxlY3RlZFRhYiAmJiBzZWxlY3RlZFRhYi4kaGlzdG9yeUlkID09IHRhYi4kaGlzdG9yeUlkICYmICFpc1RhYlJvb3RTdGF0ZSgkc3RhdGUuJGN1cnJlbnQpKSB7XG5cdFx0XHRpZiAoc2hvdWxkRW1pdEV2ZW50KSB7XG5cdFx0XHQgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuXHRcdFx0XHRkaXNhYmxlQmFjazogdHJ1ZSxcblx0XHRcdFx0aGlzdG9yeVJvb3Q6IGZhbHNlXG5cdFx0XHQgICAgfSk7XG5cdFx0XHQgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcblx0XHRcdCAgICAkc3RhdGUuZ28oZ2V0VGFiUm9vdFN0YXRlKCRzdGF0ZS4kY3VycmVudCkpO1xuXHRcdFx0fVxuXHRcdCAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVGFiICYmIHNlbGVjdGVkVGFiLiRoaXN0b3J5SWQgPT0gdGFiLiRoaXN0b3J5SWQgJiYgaXNUYWJSb290U3RhdGUoJHN0YXRlLiRjdXJyZW50KSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdCAgICB9IGVsc2Uge1xuXHRcdFx0c2VsZWN0VGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0ICAgIH1cblx0XHR9O1xuXHQgICAgfVxuXHR9O1xuICAgIH1dKTtcbiovXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=