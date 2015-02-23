/*angular.module('treeTabs', ['ionic'])
    .directive('ionTabs', ['$rootScope','$state','$ionicHistory','$ionicViewSwitcher', function($rootScope, $state, $ionicHistory, $ionicViewSwitcher) {
	function getTabRootState(state) {
	    var isRootState;

	    if (state.parent.self.abstract) {
		isRootState = state.self.name;
	    } else {
		isRootState = false;
	    }

	    return  isRootState || getTabRootState(state.parent);
	}

	function isTabRootState(state) {
	    return state.self.name === getTabRootState(state);
	}

	return {
	    restrict: 'EA',
	    require: 'ionTabs',
	    link: function(scope, element, attr, ctrl) {
		console.log('s: ',scope);
		console.log('e: ',element);
		console.log('a: ',attr);
		console.log('c: ',ctrl);
		var selectTab = ctrl.select;
		ctrl.select = function(tab, shouldEmitEvent) {
		    var selectedTab = ctrl.selectedTab();

		    if (arguments.length === 1) {
			shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
		    }

		    if (selectedTab && selectedTab.$historyId == tab.$historyId && !isTabRootState($state.$current)) {
			if (shouldEmitEvent) {
			    $ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: false
			    });
			    $ionicViewSwitcher.nextDirection('back');
			    $state.go(getTabRootState($state.$current));
			}
		    } else if (selectedTab && selectedTab.$historyId == tab.$historyId && isTabRootState($state.$current)) {
			return;
		    } else {
			selectTab.apply(this, arguments);
		    }
		};
	    }
	};
    }]);
*/
