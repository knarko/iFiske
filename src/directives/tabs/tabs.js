angular
  .module('ifiske.directives')
  .directive('hipTabs', function() {
    return {
      scope:       true,
      restrict:    'E',
      transclude:  true,
      templateUrl: 'directives/tabs/tabs.html',

      controller: function($scope, $ionicHistory, $state, $ionicViewSwitcher) {
        const tabs = [];
        this.scope = $scope;
        this.addTab = function(tab) {
          tabs.push(tab);
        };

        $scope.goto = function(elementScope) {
          let target = -1;
          for (let i = 0; i < tabs.length; ++i) {
            if ($state.is(tabs[i].viewName)) {
              target = tabs[i].index;
            }
          }
          if (target === -1 || target === elementScope.index) {
            // No transition at all
          } else if (target > elementScope.index) {
            $ionicViewSwitcher.nextDirection('back');
          } else if (target < elementScope.index) {
            $ionicViewSwitcher.nextDirection('forward');
          }
          $ionicHistory.viewHistory().currentView = $ionicHistory.viewHistory().backView;
          $state.go(elementScope.viewName, null, {
            location: 'replace',
          });
        };
      },
    };
  })
  .directive('hipTab', function() {
    return {
      scope: {
        icon:     '@',
        name:     '@',
        viewName: '@',
        index:    '@',
      },
      restrict:    'E',
      require:     '^hipTabs',
      replace:     true,
      templateUrl: 'directives/tabs/tab.html',

      link: function(scope, _elem, _attrs, controllerInstance) {
        scope.goto = controllerInstance.scope.goto;
        controllerInstance.addTab(scope);
      },
    };
  });
