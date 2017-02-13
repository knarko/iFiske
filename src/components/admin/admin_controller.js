angular.module('ifiske.controllers')
.controller('AdminCtrl', function($stateParams, Admin, $scope) {
    console.log($stateParams);
    var levelnames = [
        'USER_LEVEL_0',
        'USER_LEVEL_1',
        'USER_LEVEL_2',
    ];
    Admin.getOrganizations().then(function(res) {
        for (var e in res) {
            $scope.isAdmin = true;
            res[e].levelname = levelnames[res[e].level];
        }
        $scope.organizations = res;
    }, function(res) {
        console.error(res);
    });
})
.controller('AdminOrgCtrl', function(
  $scope,
  $state,
  $stateParams,
  Admin,
  $ionicLoading,
  $ionicHistory,
  $ionicPopover
) {
    $ionicLoading.show();

    $scope.org = $stateParams.org;

    function setValid(data) {
        $scope.licenseTypes = {
            active: {
                items: [],
                class: 'active',
                name:  'Active licenses',
            },
            inactive: {
                items: [],
                class: 'inactive',
                name:  'Inactive licenses',
            },
            expired: {
                items: [],
                class: 'expired',
                name:  'Expired licenses',
            },
            revoked: {
                items: [],
                class: 'revoked',
                name:  'Revoked licenses',
            },
        };
        for (var i = 0; i < data.length; ++i) {
            if ($scope.licenseTypes[data[i].validity] &&
                $scope.licenseTypes[data[i].validity].items)
                $scope.licenseTypes[data[i].validity].items.push(data[i]);
        }
        $scope.products = data;
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.org = false;
        init();
    });
    function init(id) {
        id = id || $stateParams.id;
        console.log('initing');
        Admin.getOrganizations().then(function(orgs) {
            $scope.orgs = Object.values(orgs);
        });

        $scope.chartOrganizationId = id;

        if ($scope.org && $scope.org.products) {
            console.log($scope.org.products);
            setValid($scope.org.products);
            $ionicLoading.hide();
        } else {
            Admin.getOrganization(id).then(function(org) {
                $scope.org = org;
                console.log($scope.org, $scope.org.products);
                setValid(org.products);
            }).finally(function() {
                $ionicLoading.hide();
            });
        }
    }

    $scope.checkLicense = function($event) {
        var code = $event.srcElement.code.value;
        $event.srcElement.code.value = '';
        if (code) {
            $state.go('^.product', {code: code});
        }
    };

    $scope.pickOrg = function($event) {
        console.log($scope);
        if (!$scope.orgPopover) {
            $scope.orgPopover = $ionicPopover.fromTemplate('<ion-popover-view>' +
            '<ion-content scroll="false">' +
            '<list>' +
            '<a ng-repeat="org in orgs" class="item" ng-click="gotoOrg(org)">{{org.ot}}</a>' +
            '</list>' +
            '</ion-content>' +
            '</ion-popover-view>', {
                scope: $scope,
            });
        }
        $scope.orgPopover.show($event);
    };
    $scope.gotoOrg = function(org) {
        $scope.orgPopover.hide();
        $scope.org = false;
        $ionicHistory.viewHistory().currentView = $ionicHistory.viewHistory().backView;
        $state.go('app.admin.org', {id: org.orgid, org: org}, {notify: false, location: 'replace'});

        init(org.orgid);
    };
});
