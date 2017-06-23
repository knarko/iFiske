angular.module('ifiske.controllers')
  .controller('NewsCtrl', function($scope, News) {
    $scope.newsTitle = News.getTitle();

    News.getAll().then(function(data) {
      $scope.content = data;
    });
  });
