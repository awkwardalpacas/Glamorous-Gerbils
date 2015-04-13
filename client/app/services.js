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
      restaurants = resp.data;
      for (var i = 0; i<resp.data.length; i++) {
        getRestaurantLocation(resp.data[i].google_id, resp.data[i].wait);
      }
      return resp.data;
    })
  }
  var getUrl = function (wait) {
    var hexColor = wait <= 20 ? '3FA71C' : wait <=40 ? 'E4fE09' : 'E21E1F';
    wait = wait < 60 ? wait : '60+';
    return 'http://www.googlemapsmarkers.com/v1/' + wait + '/' + hexColor + '/';
  }

  var getRestaurantLocation = function(id, wait) {
    var request = {placeId : id};
    var service = new google.maps.places.PlacesService(map);
    var wait = wait-(wait%5);
    var waitUrl = getUrl(wait);
    var shape = {
      coords : [1,1,21,1,10,34],
      type: 'poly'
    }
    service.getDetails(request, function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {

        var coords = new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D)
        var image = {
          url : waitUrl,
          size: new google.maps.Size(21,34),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(10,34)
        }



        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: image,
            shape: shape
        });
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