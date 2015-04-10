angular.module('nomNow.services', [])


.factory('Map', function ($http) {

  var createMap = function () {
    var position = (new google.maps.LatLong(30.269687, -97.742586));
    var MapOptions = {
      zoom: 8,
      center: position,
    };
    var map = new goole.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  return {
    createMap: createMap
  }
})