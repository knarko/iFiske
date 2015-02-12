(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.api', [])
    .provider('API', function APIProvider() {

        this.base_url = 'http://www.ifiske.se/api/v2/api.php';

        this.$get = ['$http', function($http) {
            var base_url = this.base_url;

            /**
             * # api_call #
             * handles http requests
             * returns a $http object for the requested api call
             */
            var api_call = function(params) {
                return $http(
                    {
                    method:'get',
                    url: base_url,
                    params: angular.extend(params, {'key': '0123456789abcdef'}),
                    timeout: 2000,
                    cache: true
                }
                )
                // ToDo: Proper logging
                .success(function(data) {
                    //console.log(data);
                });
            };

            /**
             * # session_api_call #
             * wrapper for api_call - inserts the session token into params
             */
            var session_api_call = function(params) {
                // ToDo: use service for localstorage?
                var session = window.localStorage.getItem('session');
                return api_call(angular.extend(params, {session: session}));
            };

            return {
                get_municipalities: function() {
                    return api_call({m: 'get_municipalities'});
                },
                get_counties: function() {
                    return api_call({m: 'get_counties'});
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
                    .success(function(data) {
                        if(data.status === 'success') {
                            window.localStorage.setItem('session', data.data.response);
                        }
                    });
                },
                user_logout: function() {
                    session_api_call({m: 'user_logout'})
                    .then(function(data) {
                        window.localStorage.removeItem('session');
                    });
                },
                user_procuts: function() {
                    return session_api_call({m: 'user_products'});
                },
                get_fishes: function() {
                    return session_api_call({m: 'get_fishes'});
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
