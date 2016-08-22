angular.module('ifiske.controllers')
.controller('NewsCtrl', function($scope, News, localStorage) {
    $scope.newsTitle = localStorage.get('NEWS');

    News.getAll().then(function(data) {
        $scope.content = data;
    });
});
