angular.module('nomNow.services', [])


.factory('Map', function ($http, $q) {
  var latLong;
  var restaurants;
  var map;
  var mapOptions = {
    zoom: 15,
    center: {}
  };


  var createMarker = function(map, coords, name) {
      return new google.maps.Marker({
        position: coords,
        map: map,
        title: name
      })
  }
  var createMap = function () {
      var that=this;
  var promise = this.getPosition();
    return promise.then(function (latLong) {
      latLong = new google.maps.LatLng(latLong.coords.latitude, latLong.coords.longitude)
      mapOptions.center = latLong;
         map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      that.createMarker(map, latLong, "You are here")
      });
  }



  var getPosition = function () {
    var deferred = $q.defer();
    navigator.geolocation.getCurrentPosition(function(position){
      deferred.resolve(position)
    });
    return deferred.promise;
  }

  var findWaitTimes = function($scope) {
    this.fetchWaitTimes($scope);
  }

  var fetchWaitTimes = function($scope) {
    return $http({
      method: 'GET',
      url: '/wait'
    })
    .then (function (resp) {
      console.log('inside', resp.data)
      restaurants = resp.data;
      for (var i = 0; i<resp.data.length; i++) {
        getRestaurantLocation(resp.data[i].google_id);
      }
      return resp.data;
    })
  }

  var getRestaurantLocation = function(id) {
    var request = {placeId : id};
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(request, function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var coords = new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D)
        var name = place.name
        createMarker(map, coords, name);
      }
    })
  }

  return {
    createMap: createMap,
    createMarker: createMarker,
    getPosition: getPosition,
    findWaitTimes: findWaitTimes,
    fetchWaitTimes: fetchWaitTimes,
    getRestaurantLocation: getRestaurantLocation
  }
})