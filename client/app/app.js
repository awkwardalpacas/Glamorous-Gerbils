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
      templateUrl: 'app/report/report.html',
      controller: 'actorController'
    })
    .otherwise({
      redirectTo: '/map'
    });
})

