angular.module('nomNow.services', [])


.factory('Map', function ($http) {
    var mapOptions = {
      zoom: 8,
      center: {lat: 30.269687, lng: -97.742586},
    };

  var createMap = function () {
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  return {
    createMap: createMap
  }
})