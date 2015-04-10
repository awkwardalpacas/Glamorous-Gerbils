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
          latLong = new google.maps.LatLng(latLong.coords.latitude, latLong.coords.longitude)
          mapOptions.center = latLong;
          console.log(mapOptions)
          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
          var marker = new google.maps.Marker({
            position: latLong,
            map: map,
            title: 'You are here'
          })
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

  var findWaitTimes = function() {
    return $http({
      method: 'GET',
      url: '/wait'
    })
    .then (function (resp) {
      return resp.body;
    })
  }

  return {
    createMap: createMap,
    getPosition: getPosition,
    findWaitTimes: findWaitTimes
  }
})