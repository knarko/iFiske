
angular.module('ifiske.controllers')
    .controller('RecoverCtrl', [
	'$scope',
	'$state',
	'$ionicHistory',
	'$ionicPlatform',
	'$ionicLoading',
	'$cordovaToast',
	'API',
	function($scope, $state, $ionicHistory, $ionicPlatform, $ionicLoading, $cordovaToast, API) {
	    'use strict';
	    
	    var user = "";
	    
	    /**
             * ToDo: use to skip from lostpassword to resetpassword
	     * skip
	     * Submit handler for skip button
	     */
            /*
	      $scope.skip = function() {
	      $scope.info = "";
	      $state.go('^.resetpassword');
	      };
            */	    

	    /**
	     * lostPassword
	     * Submit handler for first form
	     */
	    $scope.lostPassword = function(form) {

	        $ionicLoading.show();

	        user = form.user.$viewValue;

	        API.user_lost_password(user)
		    .then(function(data) {
			
			// Set info message for next view
			$scope.info = 'En återställningskod kommer skickas till dig inom kort, via ';			
			if (data.mailed) {
			    $scope.info += 'e-mail';
			    if (data.texted) {
				$scope.info += ' och ';
			    }
			}
			if (data.texted) {
			    $scope.info += 'SMS';
			}
            if (data.mailed) {
                $scope.info += '<br>Om du inte fått ditt mejl efter 10 minuter, kolla så att mejlet inte fastnat i skräpposten.'
            }

			$state.go('^.resetpassword');

		    }, function(error) {
			//ToDo: handle timeout?
			//ToDo: check error codes?
			form.user.$setValidity('invalidUser', false);
		    })
		    .finally($ionicLoading.hide);
	    };


	    /**
	     * resetPassword
	     * Submit handler for second form
	     *
	     * ToDo: log in immediately?
	     */
	    $scope.resetPassword = function(form) {
		$ionicLoading.show();
		
		
		API.user_reset_password(user, form.password.$viewValue, form.code.$viewValue)
		    .then(function(data) {
		
                        //ToDo: handle timeouts?

                        //ToDo: .ready() needed?
	                // Success toast
		        $ionicPlatform.ready(function() {
		            $cordovaToast.showLongBottom('Ditt lösenord har ändrats');
		        });
	        			
                        $state.go('app.login');

                        // Navigate to current history root?
			//$ionicHistory.goToHistoryRoot($ionicHistory.currentView().historyId);	
		    }, function(error) {
                        switch(error.error_code) {
                        /*case 5:
                            //invalide username
                            break;*/
                        /*case 13:
                            form.password.$setValidity('passwordLength', false);
                            break;*/
                        case 16:
		            form.code.$setValidity('invalidCode',false);
                            break;
                        }
		    })
		    .finally($ionicLoading.hide);
	    };
	}]);
