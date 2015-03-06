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
