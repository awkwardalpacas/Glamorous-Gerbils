var nomNow = angular.module('nomNow.map', ['ui.bootstrap'])


nomNow.controller('mapController', function ($scope, $location, $q, Map) {
  $scope.createMap = function() {
    return Map.createMap();
  }

  $scope.findWaitTimes = function() {
    Map.findWaitTimes($scope)
  }

  $scope.createMap()
    .then(function() {
      $scope.findWaitTimes()
    });

});

