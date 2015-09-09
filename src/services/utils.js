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
}])

.factory('Licenses', [
    '$http',
    function($http) {
        return {
            get: function() {
                return $http.get('static/licenses.json');
            }
        };
    }
]);
