(function(angular, undefined) {
    'use strict';
    
    angular.module('ifiske.api', [])
	.provider('API', function APIProvider() {
	    
	    this.base_url = 'http://www.ifiske.se/api/v2/api.php';
	    
	    this.$get = ['$http', function($http) {
		var base_url = this.base_url;
		
		var api_call = function(params, callback, error) {
		    return $http(
			{
			    method:'get',
			    url: base_url,
			    params: params,
			    timeout: 2000,
			    cache: false
			}
		    )
		}

		return {
		    get_municipalities: function() {
			return api_call({m: 'get_municipalities'});
		    }
		    ,get_fishes: function() {
			return api_call({m: 'get_fishes'});
		    }
		    ,user_register: function() {
			return api_call({m: 'user_register'});
		    }
		    ,user_confirm: function() {
			return api_call({m: 'user_confirm'});
		    }
		    ,user_info: function() {
			return api_call({m: 'user_info'});
		    }
		    
		    /*
		      : function() {
			return api_call({m: ''});
		    }
		    */
		}
	    }];
	})
})(window.angular);
