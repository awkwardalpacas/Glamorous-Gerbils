angular.module('nomNow', [
  'nomNow.services',
 'ngRoute'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/map', {
      templateUrl: './map/map.html',
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

