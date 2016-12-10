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
  $ionicPopover,
  API
) {
    $scope.id = $stateParams.id;
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

    $scope.$on('$ionicView.beforeEnter', function() {
        Admin.getOrganizations().then(function(orgs) {
            $scope.orgs = Object.values(orgs);
        });

        API.adm_get_stats($stateParams.id).then(function(stats) {
            stats = stats[$stateParams.id];
            console.log(stats);
            $scope.chart.data = [
                Object.values(stats.weeks),
            ];
            $scope.chart.labels = [];
            for (var i in stats.weeks) {
                $scope.chart.labels.push(moment().subtract(i, 'week'));
            }
        }, function(err) {
            console.error(err);
        });

        if ($scope.org && $scope.org.products) {
            console.log($scope.org.products);
            setValid($scope.org.products);
            $ionicLoading.hide();
        } else {
            Admin.getOrganization($stateParams.id).then(function(org) {
                $scope.org = org;
                console.log($scope.org, $scope.org.products);
                setValid(org.products);
            }).finally(function() {
                $ionicLoading.hide();
            });
        }
    });

    $scope.checkLicense = function($event) {
        var code = $event.srcElement.code.value;
        $event.srcElement.code.value = '';
        if (code) {
            $state.go('^.product', {code: code});
        }
    };

    $scope.chart = {};
    $scope.chart.series = ['Sålda fiskekort'];
    $scope.chart.datasetOverride = [
        {
            type:            'bar',
            borderWidth:     0,
            backgroundColor: '#006696',
        },
    ];
    $scope.chart.options = {
        stacked:          true,
        lineAtYearChange: true,
        fill:             false,
        scales:           {
            yAxes: [{
                id:       'y-axis-0',
                type:     'linear',
                display:  true,
                position: 'left',
            }],
            xAxes: [{
                id:                 'x-axis-0',
                type:               'time',
                barPercentage:      .3,
                categoryPercentage: 1,
                time:               {
                    min:            moment().subtract(1, 'year').subtract(1, 'week'),
                    max:            moment().add(1, 'week'),
                    round:          'week',
                    unitStepSize:   3,
                    tooltipFormat:  '[vecka] W',
                    displayFormats: {
                        week:  'MMM YYYY',
                        month: 'MMM',
                    },
                    unit: 'month',
                },
                labels: {
                    show: false,
                },
            }],
        },
    };

    $scope.pickOrg = function($event) {
        console.log($scope);
        if (!$scope.orgPopover) {
            $scope.orgPopover = $ionicPopover.fromTemplate('<ion-popover-view>' +
            '<ion-content scroll="false">' +
            '<list>' +
            '<a ng-repeat="org in orgs" class="item" ui-sref="^.org({id: org.orgid, org: org})" ng-click="orgPopover.hide()">{{org.ot}}</a>' +
            '</list>' +
            '</ion-content>' +
            '</ion-popover-view>', {
                scope: $scope,
            });
        }
        $scope.orgPopover.show($event);
    };
});
var originalLineDraw = Chart.controllers.bar.prototype.draw;
Chart.helpers.extend(Chart.controllers.bar.prototype, {
    draw: function() {
        originalLineDraw.apply(this, arguments);

        var chart = this.chart;
        var ctx = chart.chart.ctx;

        if (chart.config.options.lineAtYearChange) {
            var xaxis = chart.scales['x-axis-0'];
            var yaxis = chart.scales['y-axis-0'];

            var xPixel = xaxis.getPixelForValue(moment().startOf('year'));

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xPixel, yaxis.top);
            ctx.strokeStyle = '#006696';
            ctx.lineTo(xPixel, yaxis.bottom);
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillText(moment().format('[\']YY'), xPixel + 4, yaxis.top + 10);
            ctx.textAlign = 'right';
            ctx.fillText(moment().subtract(1, 'year').format('[\']YY'), xPixel - 4, yaxis.top + 10);

            ctx.restore();
        }
    },
});
