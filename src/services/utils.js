angular.module('ifiske.services')

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
      },
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
        },
      };
    },
  ])

  .constant('debounce', function debounce(callback, delay) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        callback.apply(context, args);
      }, delay);
    };
  })

  .filter('distance', function distanceFilter() {
    return function(distance) {
      if (!distance) {
        return '';
      }

      if (distance > 2000) {
        return Math.round(distance / 1000) + 'km';
      } else if (distance > 500) {
        return Number(distance / 1000).toPrecision(2) + 'km';
      }

      return distance + 'm';
    };
  });
