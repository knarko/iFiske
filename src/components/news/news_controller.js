angular.module('ifiske.controllers')
.controller('NewsCtrl', [
    '$scope',
    'DB',
    'localStorage',
    function($scope, DB, localStorage) {
        $scope.newsTitle = localStorage.get('NEWS');

        DB.getNews().then(function(data) {
            $scope.content = data;
        });
    },
]);
