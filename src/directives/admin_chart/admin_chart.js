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

angular.module('ifiske.directives')
.directive('adminChart', function() {
    return {
        restrict:    'E',
        transclude:  false,
        templateUrl: 'directives/admin_chart/admin_chart.html',

        scope: {
            chartOrganizationId: '=',
        },
        controller: function($scope, Admin) {
            $scope.$watch('chartOrganizationId', function(id) {
                Admin.stats(id).then(function(stats) {
                    stats = stats[id];
                    console.log(stats);
                    if (stats && stats.weeks) {
                        $scope.showChart = true;
                        $scope.chart.data = [
                            Object.values(stats.weeks),
                        ];
                        $scope.chart.labels = [];
                        for (var i in stats.weeks) {
                            $scope.chart.labels.push(moment().subtract(i, 'week'));
                        }
                    } else {
                        $scope.showChart = false;
                    }
                }, function(err) {
                    $scope.showChart = false;
                    console.error(err);
                });
            });
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
                        barPercentage:      1,
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
        },
    };
});
