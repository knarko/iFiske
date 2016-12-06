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
        $scope.chartData = {};
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
  $ionicPopup,
  $translate,
  API
) {
    $scope.id = $stateParams.id;
    $ionicLoading.show();

    $scope.org = $stateParams.org;

    function setValid(data) {
        $scope.licenseTypes = {
            active: {
                items: [],
                name:  'Active licenses',
            },
            inactive: {
                items: [],
                name:  'Inactive licenses',
            },
            expired: {
                items: [],
                name:  'Expired licenses',
            },
            revoked: {
                items: [],
                name:  'Revoked licenses',
            },
        };
        for (var i = 0; i < data.length; ++i) {
            if (!$scope.licenseTypes[data[i].validity]) {
                $scope.licenseTypes[data[i].validity] = {
                    items: [],
                    name:  data[i].validity[0].toUpperCase() + data[i].validity.substr(1) + ' licenses',
                };
            }
            $scope.licenseTypes[data[i].validity].items.push(data[i]);
        }
        $scope.products = data;
    }

    if ($scope.org) {
        setValid($scope.org.products);
        $ionicLoading.hide();
    } else {
        Admin.getOrganization($stateParams.id).then(function(org) {
            $scope.org = org;
            setValid(org.products);
        }).finally(function() {
            $ionicLoading.hide();
        });
    }

    $scope.checkLicense = function($event) {
        if ($event.keyCode === 13 && !$event.shiftKey) { // if enter-key
            var code = $event.srcElement.value;
            $event.srcElement.value = '';
            if (code) {
                $state.go('^.product', {code: code});
            }
        }
    };

    API.adm_get_stats($scope.org.id).then(function(stats) {
        console.log(stats);
        $scope.chart.data = [
            stats.weeks,
        ];
    }, function(err) {
        console.error(err);
    });
    $scope.chart = {};
    $scope.chart.labels = []; // "January", "February", "March", "April", "May", "June", "July"];
    var now = new Date() - 365 * 3600 * 24 * 1000;
    for (var i = 52; i > 0; --i) {
        $scope.chart.labels.push(moment().subtract(i, 'week'));
    }
    console.log($scope.chart);
    $scope.chart.series = ['Sålda fiskekort'];
    $scope.chart.data = [
        [
            20, 10, 10, 12, 30, 40, 50, 10, 60, 85,
            100, 60, 200, 30, 100, 130, 122, 130, 170, 200,
            100, 60, 200, 30, 100, 130, 122, 130, 170, 200,
            20, 10, 10, 12, 30, 40, 50, 10, 60, 85,
            20, 10, 10, 12, 30, 40, 50, 10, 60, 85, 10, 20,
        ],
    ];
    $scope.chart.onClick = function(points, evt) {
        console.log(points, evt);
    };
    $scope.chart.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
    $scope.chart.options = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    min:            moment().subtract(1, 'year').subtract(1, 'week'),
                    max:            moment().add(1, 'week'),
                    round:          'week',
                    unitStepSize:   1,
                    tooltipFormat:  '[vecka] W',
                    displayFormats: {
                        week: 'MMM YYYY',
                    },
                    unit: 'quarter',
                },
                labels: {
                    show: false,
                },
            }],
            yAxes: [
                {
                    id:       'y-axis-1',
                    type:     'linear',
                    display:  true,
                    position: 'left',
                },
            ],
        },
    };
    console.log($scope, $scope.chart);
});
