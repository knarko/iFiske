// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ifiske' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ifiske.services' is found in services.js
// 'ifiske.controllers' is found in controllers.js
angular.module('ifiske', ['ionic', 'ifiske.controllers', 'ifiske.services', 'ifiske.api'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html'
		})
	.state('areas', {
		url: '/areas',
		templateUrl: 'templates/areas.html',
		controller: 'AreasCtrl'
	})
	.state('areadetail', {
		url: '/area/:id',
		templateUrl: 'templates/area.detail.html',
		controller: 'AreaDetailCtrl'
	})
	.state('register', {
		url: '/register',
		templateUrl: 'templates/register.html',
	})
	.state('main', {
		url: '/',
		templateUrl: 'templates/main.html',
	});

});

