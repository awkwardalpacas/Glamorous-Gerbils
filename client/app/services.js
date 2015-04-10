angular.module('nomNow.services', [])


.factory('Map', function ($http, $q) {
  var latLong;

    var mapOptions = {
      zoom: 15,
      center: {}
    };

  var createMap = function () {
  var promise = this.getPosition();
    promise.then(function (latLong) {
          mapOptions.center.lat = latLong.coords.latitude;
          mapOptions.center.lng = latLong.coords.longitude;
          console.log(mapOptions)
          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      });
  }



  var getPosition = function () {
    var deferred = $q.defer();
    deferred.notify('before')
    navigator.geolocation.getCurrentPosition(function(position){
      deferred.resolve(position)
    });
    return deferred.promise;
  }

  return {
    createMap: createMap,
    getPosition: getPosition,
  }
})