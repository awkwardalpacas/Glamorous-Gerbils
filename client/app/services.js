var getOneRestaurantWaitTime, displayGraph;

angular.module('nomNow.services', [])

.factory('Map', function ($http, $q) {
  var latLong;
  var restaurants;
  var typeFilter = ['restaurant','meal_takeaway','cafe','bar'];
  var map;
  var mapOptions = {
    zoom: 17,
    center: {}
  };
  var privwindow = false;
  var mapscope;
  //Creates marker for user's location
  var createMarker = function(map, coords, name) {
      return new google.maps.Marker({
        position: coords,
        map: map,
        title: name
      });
  }
  //generates the map
  var createMap = function () {
    var that=this;
    var promise = this.getPosition();
    return promise.then(function (latLong) {
      latLong = new google.maps.LatLng(latLong.coords.latitude, latLong.coords.longitude);
      mapOptions.center = latLong;
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      that.createMarker(map, latLong, "You are here");
      return map;
    });
  }

  //reposition map
  var centerMap = function(place){
    // var place = scope.gPlace.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(17);
        // search();
      } else {
        // document.getElementById('autocomplete').placeholder = 'Not Found, Try Again';
      }
      //check to see if thing is in database already...

      for (var i = 0; i < typeFilter.length; i++) {
        if (place.types.indexOf(typeFilter[i])) {
          //need to avoid adding to db if already there, maybe this is already handled..

      var info= {data:{google_id:place['place_id'],
      name:place['name'],
      longitude: place.geometry.location["D"],
      latitude: place.geometry.location["k"],
      'wait':-1}};
      getweb(place['place_id'],function(place, status){
        info['data']['website']=place['website']
          $http({
            method: 'POST',
            url: '/wait',
            data: info
          }).success(function(){
            fetchWaitTimes();
          });
      })
      return;
        }
      }
  }
  //Gets users current position
  var getPosition = function () {
    var deferred = $q.defer();
    navigator.geolocation.getCurrentPosition(function(position){
      deferred.resolve(position)
    });
    return deferred.promise;
  }

  var findWaitTimes = function($scope) {
    if($scope){mapscope = $scope;}
    else{$scope = mapscope};
    this.fetchWaitTimes($scope);
  }
  //pulls all the wait times from the reports database
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
    });
  }
  //generates a marker with correct number and color for each waittime
  var getWaitTimeMarkerUrl = function (wait) {
    if (wait>0) {
      var hexColor = wait <= 20 ? '3FA71C' : wait <=40 ? 'E4fE09' : 'E21E1F';
      wait = wait < 60 ? wait : '60+';
      return 'http://www.googlemapsmarkers.com/v1/' + wait + '/' + hexColor + '/';
    } else {
      return 'http://www.googlemapsmarkers.com/v1/' + 'F5F5DC' + '/';
    }
  }
  //calculates time between right now and the most recent wait time post
  var getElapsedTime = function(timestamp) {
    var now = new Date();
    var then = new Date(timestamp);
    return Math.round((now-then)/60000);
  }
  //takes in a google places restaurant, generates marker at that location
  var getRestaurantLocation = function(restaurant) {
    if ((restaurant.avg_wait < 0) && ((getElapsedTime(restaurant.most_recent)) > 30 )) {
      return;
    } 
        var wait = restaurant.avg_wait;
        var waitUrl = getWaitTimeMarkerUrl(wait);
        var shape = {
          coords : [1,1,21,1,10,34],
          type: 'poly'
        }
        var coords = new google.maps.LatLng(restaurant.latitude, restaurant.longitude);
        var name = restaurant.name;
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
          var elapsed = getElapsedTime(restaurant.most_recent);
          displayInfo (marker, restaurant, wait, elapsed);
     
  }
////////////  Modal needed function to pass on restaurant data

  var getClosestRestaurant = function (cb,byname){
    // temp vars to find closest restaurant
    var mylat = null;
    var mylong = null;
    var choices = []
    getPosition().then(function(value){
      var myloc = map.center;
      var request = {
          location: myloc,
          rankBy: google.maps.places.RankBy.DISTANCE,
          types: typeFilter
        };

      // api request that gets closest places.
      var service = new google.maps.places.PlacesService(map);

      service.nearbySearch(request, function(value){
        //looping the result to find closet restaurant
          for(var x =0 ; x<value.length; x++){
            var coords = value[x]['geometry']['location'];
            var place = value[x]['name']
            var key = value[x]['place_id']
            var obj= {location:coords, 'name':place, 'google_id':key}
            getDistanceFromLatLonInKm(mylat, mylong, coords["k"], coords["D"],obj,
            //after calculating distance in helper below this function compares the lowest distance.
              function(dis, obj){
                choices.push(obj);
            })
          }
          //set time out lets us wait till data is processed
          setTimeout(function(){
            choices.length = 5;
            var closest = choices
            cb(closest);
          }, 1000)
        });
    })
  }


  ////////////helper functions
  var deg2rad =function (deg) {
    return deg * (Math.PI/180)
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2,obj, cb) {
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
    cb(d, obj);
  }


  //creates the info window that pops up when user clicks on a marker
  var displayInfo = function (marker, place, wait, elapsed) {
    var site = place.website === undefined ? '' : place.website;

    if (wait>0){
      var infowindow = new google.maps.InfoWindow({
        content: '<p>' + place.name+'<br />Wait time is ' + wait +
        ' minutes.<br />Information is '+ elapsed+ ' minutes old.</p>' +
        '<a href = "' + place.website + '">' + site + '</a><br />' +
        '<button id="graph-link" data-id="' + place.google_id + '", data-name="' + place.name + '" href="">5-Day Wait Time Average</button>'
      });
    } else {
        var infowindow = new google.maps.InfoWindow({
        content: '<p>' + place.name+'<br />No wait time information is currently available.</p>' +
        '<a href = "' + place.website + '">' + site + '</a>'
      });
    }

    google.maps.event.addListener(marker, 'click', function() {
      if(privwindow){ privwindow.close() }
      privwindow = infowindow;
      infowindow.open(marker.get('map'), marker);
    });
  }

  var getweb = function(id,cb){
    var request = {placeId: id};
      var service = new google.maps.places.PlacesService(map);
      service.getDetails(request,cb);
  }

  getOneRestaurantWaitTime = function (id, placename, $scope) {
    return $http({
      method: 'POST',
      url: '/wait',
      data: {
        id: id,
        oneFlag: true
      }
    })
    .then (function (resp) {
      var restaurantInfo = resp.data.sort(function(a, b){
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      });

      // twelve hours are currently hardcoded for each restaurant
      // future implementation: calculate based on opening/closing times
      var startDate = new Date(restaurantInfo[0].created_at);

      var hours = {};
      for (var i = 0; i < restaurantInfo.length; i++) {
        var currentDate = new Date(restaurantInfo[i].created_at);
        var currentHour = currentDate.getHours();
        
        if ( hours[currentHour] ) {
          hours[currentHour].push(restaurantInfo[i].wait_time);
        } else {
          hours[currentHour] = [restaurantInfo[i].wait_time];
        }
      }

      var data = [];

      for ( hour in hours ) {
        var sum = hours[hour].reduce(function (a, b) {
          return a + b;
        });

        data.push( sum / (hour.length) );
      }

      displayGraph(id, placename, data);
    });
  }

  displayGraph = function (id, placename, data) {
    // append graph to id="graph-link" in the infowindow using highcharts
    $('#graph-link').highcharts({
      title: {
        text: 'Average Wait for ' + placename + ', Last 5 Days',
        x: 20
      },
      xAxis: {
        categories: ['8AM', '9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PMM', '6PM', '7PM']
      },
      yAxis: {
        title: {
          text: 'Wait (min)'
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        data: data
      }]
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
    displayInfo: displayInfo,
    getweb:getweb,
    centerMap: centerMap,
    map: map
  }
});


$('body').on('click', '#graph-link', function (event) {
  var id = $(this).data('id');
  var placename = $(this).data('name');

  $(this).css({
    height: '250px',
    margin: '0 auto',
    width: '500px'
  });

  getOneRestaurantWaitTime(id, placename);
});