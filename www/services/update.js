(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.update', ['ifiske.api', 'ifiske.db', 'ifiske.utils'])
    .provider('Update', function UpdateProvider() {


        this.$get = ['API', 'DB', 'localStorage', '$q', '$ionicLoading', function(API, DB, localStorage, $q, $ionicLoading) {

            var LAST_UPDATE = 'last_update';

            var updateFunc = function(updateTime) {
                $ionicLoading.show();
                //TODO: if an error occurs, tell the user and stop the spinning

                var currentTime = Date.now();

                var lastUpdate = updateTime;
                if(typeof(lastUpdate) !== 'number') {
                    lastUpdate = localStorage.get(LAST_UPDATE);
                }

                var aWeek = 1000*3600*24*7;
                if(currentTime - lastUpdate > aWeek) {
                    DB.init()
                    .then(function() {
                        console.log('Initialized DB system');
                        return DB.populate();
                    })

                    .then(function(){
                        console.log('Populated all the things');
                        localStorage.set(LAST_UPDATE, currentTime);
                        $ionicLoading.hide();
                    }, function(err) {
                        console.log('Got an error, will try to recreate all tables: ', err);

                        return DB.clean()
                        .then(function(){
                            return DB.init();
                        })

                        .then(function(){
                            return DB.populate();
                        })

                        .then(function(){
                            console.log('Populated all the things');
                            localStorage.set(LAST_UPDATE, currentTime);
                            $ionicLoading.hide();
                        }, function(err) {
                            console.log('Still error, handle it!', err);
                            $ionicLoading.hide();
                        });
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
                    updateFunc(0);
                }
            };
        }];
    });
})(window.angular);
