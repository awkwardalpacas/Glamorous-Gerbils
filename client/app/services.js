angular.module('nomNow.services', [])


.factory('Map', function ($http, $q) {
  var latLong;
  var restaurants;
  var map;
  var mapOptions = {
    zoom: 15,
    center: {}
  };
  var locations={};

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
        getRestaurantLocation(resp.data[i]);
      }
      return resp.data;
    })
  }
  var getWaitTimeMarkerUrl = function (wait) {
    var hexColor = wait <= 20 ? '3FA71C' : wait <=40 ? 'E4fE09' : 'E21E1F';
    wait = wait < 60 ? wait : '60+';
    return 'http://www.googlemapsmarkers.com/v1/' + wait + '/' + hexColor + '/';
  }

  var getElapsedTime = function(timestamp) {
    var now = new Date();
    var then = new Date(timestamp)
    return Math.round((now-then)/60000);
  }

  var getRestaurantLocation = function(restaurant, cb) {
    var request = {placeId : restaurant.google_id};
    var service = new google.maps.places.PlacesService(map);
    var wait = restaurant.wait-(restaurant.wait%5);
    var waitUrl = getWaitTimeMarkerUrl(wait);
    var shape = {
      coords : [1,1,21,1,10,34],
      type: 'poly'
    }
    service.getDetails(request, function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var coords = new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D)
        var name = place.name
        if(cb){
          cb(coords,place.name);
        }else{
        locations[restaurant.google_id]=[coords,place.name]

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
        var elapsed = getElapsedTime(restaurant.timestamp)
        displayInfo (marker, place, wait, elapsed);
      }
      }
    })
  }
////////////  Modal needed function to pass on restaurant data

  var getClosestRestaurant = function (cb){

    var mylat = null;
    var mylong = null;
    var currentLowest = null;
    var currentRestaurant = null;
    var currentid=null
    getPosition().then(function(value){
      mylat = value.coords.latitude
      mylong = value.coords.longitude

      for(var key in locations){
          coords = locations[key][0]
          place = locations[key][1]
            getDistanceFromLatLonInKm(mylat, mylong, coords["k"], coords["D"],
            function(dis){
              if(currentLowest===null||currentLowest>dis){
                currentLowest = dis;
                currentRestaurant = place;
                currentid = key;
              }
        })
      }
    })
        setTimeout(function(){
        var closest = {name:currentRestaurant , google_id:currentid}
        cb(closest);
        }, 1000)
  }

  ////////////helper functions
  var deg2rad =function (deg) {
    return deg * (Math.PI/180)
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2, cb) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
    cb(d);
  }


///////////////////////////////////////////////////
  var displayInfo = function (marker, place, wait, elapsed) {
    var infowindow = new google.maps.InfoWindow({
      content: '<p>' + place.name+'<br />Wait time is ' + wait +
      ' minutes.<br />Information is '+ elapsed+ ' minutes old.</p>'
    })
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(marker.get('map'), marker);
    });
  }

  return {
    createMap: createMap,
    createMarker: createMarker,
    getPosition: getPosition,
    findWaitTimes: findWaitTimes,
    fetchWaitTimes: fetchWaitTimes,
    getRestaurantLocation: getRestaurantLocation,
    getClosestRestaurant:getClosestRestaurant,
    displayInfo: displayInfo
  }
})
