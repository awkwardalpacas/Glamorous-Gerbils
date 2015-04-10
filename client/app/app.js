angular.module('nomNow', [
  'nomNow.services',
  'nomNow.map',
 'ngRoute'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/map', {
      templateUrl: 'app/map/map.html',
      controller: 'mapController'
    })
    .when ('/report', {
      templateUrl: 'scripts/actors/actors.html',
      controller: 'actorController'
    })
    .otherwise({
      redirectTo: '/map'
    });
})

