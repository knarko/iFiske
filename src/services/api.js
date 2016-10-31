/* eslint-disable camelcase */
angular.module('ifiske.services')
.provider('API', function APIProvider() {
    this.$get = function($http, sessionData, $q, Settings, serverLocation) {
        var base_url = serverLocation + '/api/v2/api.php';

        /**
        * # api_call #
        * handles http requests
        * returns a $http object for the requested api call
        */
        function api_call(params, cache) {
            return $q(function(fulfill, reject) {
                $http({
                    method: 'get',
                    url:    base_url,
                    params: angular.extend(params, {
                        lang: Settings.language(),
                        key:  'ox07xh8aaypwvq7a',
                    }),
                    timeout: 7000,
                    cache:   (cache !== false),
                })
                // ToDo: Proper logging
                .success(function(data) {
                    if (data.status === 'error') {
                        reject(data.message);
                    } else if (data.data) {
                        fulfill(data.data.response);
                    } else {
                        reject(data);
                    }
                })
                // .error(function(data, status, headers, config, statusText) {
                .error(function(data, status) {
                    if (status === 0) {
                        reject(new Error('Request timeout'));
                    } else {
                        reject(data);
                    }
                });
            });
        }

        /**
        * # session_api_call #
        * wrapper for api_call - inserts the session token into params
        */
        function session_api_call(params, cache) {
            var session = sessionData.token;
            return api_call(angular.extend(params, {s: session}), cache);
        }

        return {
            get: function(m, extras) {
                return api_call(angular.extend({m: m}, extras));
            },

            get_municipalities: function() {
                return api_call({m: 'get_municipalities'});
            },
            get_counties: function() {
                return api_call({m: 'get_counties'});
            },
            user_exists: function(username, email) {
                var args = {m: 'user_exists'};

                if (username && typeof username === 'string') {
                    args.username = username;
                }
                if (email && typeof email === 'string') {
                    args.email = email;
                }

                return api_call(args, false);
            },
            user_register: function(userDetails) {
                return api_call(angular.extend({m: 'user_register'}, userDetails), false);
            },
            user_confirm: function(username, pin) {
                return api_call({
                    m:        'user_confirm',
                    username: username,
                    pin:      pin,
                }, false);
            },
            user_info: function() {
                return session_api_call({m: 'user_info'});
            },
            user_lost_password: function(user) {
                return api_call({
                    m:                   'user_lost_password',
                    user_identification: user,
                }, false);
            },
            user_reset_password: function(user_identification, password, code) {
                return api_call({
                    m:                   'user_reset_password',
                    user_identification: user_identification,
                    password:            password,
                    code:                code,
                }, false);
            },
            user_change_password: function(old_password, new_password) {
                return session_api_call({
                    m:            'user_change_password',
                    old_password: old_password,
                    new_password: new_password,
                }, false);
            },
            user_login: function(username, password) {
                return api_call({
                    m:        'user_login',
                    username: username,
                    password: password,
                }, false)
                .then(function(data) {
                    sessionData.setToken(data);
                    // needed for chaining of promises
                    return data;
                });
            },
            user_logout: function() {
                return session_api_call({m: 'user_logout'}, false)
                .then(function() {
                    sessionData.deleteToken();
                });
            },
            user_products: function() {
                return session_api_call({m: 'user_products'}, false);
            },
            user_get_pushtoken: function() {
                return session_api_call({m: 'user_get_pushtoken'}, false);
            },
            user_get_secret: function() {
                return session_api_call({m: 'user_get_secret'}, false);
            },
            user_set_pushtoken: function(token) {
                return session_api_call({
                    m:     'user_set_pushtoken',
                    token: token,
                    type:  1, // 1 is for ionic
                }, false);
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
                return api_call({
                    m:     'get_organizations',
                    orgid: orgid,
                });
            },
            get_org_modified: function(orgid) {
                return api_call({
                    m:     'get_org_modified',
                    orgid: orgid,
                });
            },
            get_areas: function(areaid) {
                return api_call({
                    m:      'get_areas',
                    areaid: areaid,
                });
            },
            get_areas_modified: function(areaid) {
                return api_call({
                    m:      'get_areas_modified',
                    areaid: areaid,
                });
            },
            get_products: function(areaid) {
                return api_call({
                    m:      'get_products',
                    areaid: areaid,
                });
            },
            get_rules: function(ruleid) {
                return api_call({
                    m:      'get_rules',
                    ruleid: ruleid,
                });
            },
            get_photos: function(orgid, areaid) {
                return api_call({
                    m:      'get_photos',
                    orgid:  orgid,
                    areaid: areaid,
                });
            },
            get_map_pois: function(orgid) {
                return api_call({
                    m:     'get_map_pois',
                    orgid: orgid,
                });
            },
            get_map_poi_types: function() {
                return api_call({m: 'get_map_poi_types'});
            },
            get_map_polygons: function(orgid) {
                return api_call({
                    m:     'get_map_polygons',
                    orgid: orgid,
                });
            },
            user_get_favorites: function() {
                return session_api_call({m: 'user_get_favorites'}, false);
            },
            user_add_favorite: function(area) {
                // Flag 0 means to not get notifications on catch reports
                return session_api_call({m: 'user_add_favorite', areaid: area, flag: 0}, false);
            },
            user_set_favorite_notification: function(area, flag) {
                flag = flag ? 1 : 0;
                return session_api_call({
                    m:      'user_set_favorite_notification',
                    areaid: area,
                    flag:   flag,
                }, false);
            },
            user_remove_favorite: function(area) {
                return session_api_call({m: 'user_remove_favorite', areaid: area}, false);
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
            },
            get_mapbox_api: function() {
                return api_call({m: 'get_mapbox_apiaccesstoken'});
            },
            get_content_menu: function() {
                return api_call({m: 'get_content_menu'});
            },
        };
    };
});
