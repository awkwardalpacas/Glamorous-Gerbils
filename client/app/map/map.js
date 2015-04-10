angular.module('nomNow.map', [])


.controller('mapController', function ($scope, $location, Map) {
  var createMap = function() {
    Map.createMap();
  }

  createMap();

})
