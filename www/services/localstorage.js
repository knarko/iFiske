angular.module('ionic.utils', [])

// ToDo: rename? remove $?
    .factory('$localstorage', ['$window', function($window) {
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
    .service('sessionData', ['$localstorage', function($localstorage) {
	this.token = $localstorage.get('session');

	this.setToken = function(t) {
	    $localstorage.set('session', t);
	    this.token = t;
	    console.log('token set');
	}
	this.deleteToken = function() {
	    $localstorage.remove('session');
	    this.token = null;
	    console.log('token unset');
	}
    }]);
