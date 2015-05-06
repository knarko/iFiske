angular.module('ifiske.utils', [])

.factory('Licenses', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('/licenses.json').then(function(data) {
                return data.data;
            });
        }
    };
}])
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
