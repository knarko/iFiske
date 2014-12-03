
(function(angular, undefined) {
    'use strict';
    
    // ToDo: Test without 'ngResource'
    angular.module('ifiske.api', ['ngResource'])
	.provider('API', function APIProvider() {
	    
	    // Defaults for all $resource objects, set in config block
	    this.defaults = {
		// ToDo: with or without trailing slash?
		baseURL: ''
		,params: {}
		,actions: {}
	    };
	    
	    /**
	     * Contains method configuration objects - used to generate $resource objects
	     *
	     * resource: string - concatenated with defaults.baseURL
	     * params: object   - merged with defaults.params
	     * actions: object  - merged with default.actions
	     */
	     this.methods = [];
	    

	    this.$get = ['$resource', function($resource) {
		var methods = this.methods;
		var defaults = this.defaults;

		var api = {};
		for (var i = 0; i < methods.length; ++i) {
		    var config = methods[i];

		    api[config.name] = $resource(
			defaults.baseURL + '/' + (config.resouce || ''),
			angular.extend({}, defaults.params, config.params),
			angular.extend({}, defaults.actions, config.actions)
		    );
		}
		return api;
	    }];
	})

	.config(['APIProvider', function(APIProvider) {
	    // without leading 'http://' baseURL will default to 'localhost/...'
	    APIProvider.defaults.baseURL = 'http://www.ifiske.se/api/v2/api.php';

	    // Interceptor: logs http errors
	    var interceptor = {
		response: function(response) {
		    console.log(response);
		}, 
		// ToDo: add proper logger
		responseError: function(response) {
		    console.log(response); 
		}
	    }

	    // Set default values for GET
	    APIProvider.defaults.actions.get = { 
		method: 'GET'
		,timeout: 2000
		,interceptor: interceptor
	    };
	    
	    // Set default values for POST
	    APIProvider.defaults.actions.post = {
		method: 'POST'
		,timeout: 2000
		,interceptor: interceptor
	    };


	    APIProvider.methods = [
		{name: 'get_municipalities', params: {m: 'get_counties'
						      ,region: '@region'
						     }}

		,{name: 'get_counties', params: {m: 'get_counties'
						}}

		,{name: 'user_register', params: {m: 'user_register'
						  ,username: '@username'
						  ,fullname: '@fullname'
						  ,password: '@email'
						  ,email: '@email'
						  ,phone: '@phone'
						 }}

		,{name: 'user_confirm', params: {m: 'user_confirm'
						 ,username: '@username'
						 ,pin: '@pin'
						}}

		,{name: 'user_info', params: {m: 'user_info'
					      ,session: '@session'
					     }}
		//
		,{name: 'user_login', params: {m: 'user_login'
					       ,username: '@username'
					       ,email: '@email'
					       ,password: '@password'
					      }}

		,{name: 'user_logout', params: {m: 'user_logout'
						,session: '@session'
					       }}

		,{name: 'user_products', params: {m: 'user_products'
						  ,session: '@session'
						 }}

		,{name: 'get_fishes', params: {m: 'get_fishes'
					      }}
		//,{name: '', params: {m: ''}}
	    ];
	}])
// ToDo: use $angular instead of window.angular?
})(window.angular);
