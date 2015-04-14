angular.module('nomNow.map', ['ui.bootstrap'])


.controller('mapController', function ($scope, $location, $q, Map) {
  $scope.createMap = function() {
    return Map.createMap();
  }

  $scope.findWaitTimes = function() {
    Map.findWaitTimes($scope)
  }

  $scope.createMap()
    .then(function() {
      $scope.findWaitTimes()
    })

})


.controller("modalctrl", ["$scope","$modal","Map",function ($scope,$modal,$log,Map) {
  $scope.items = "rusty bar"
  $scope.reportpage= function(){
    var modalInstance = $modal.open({
      templateUrl: 'Report.html',
      controller: 'ModalInstanceCtrl',
      size: 'lr',
      resolve: {
        items: function () {
          return $scope.itmes;
        }
      }
  })
    modalInstance.result.then(function(selectedItem){
      $scope.selected= selectedItem;
      },function(){
        $log.info('Modal dismissed at: ' + new Date());
    }) 
  }
}])
.controller('ModalInstanceCtrl',["$scope","$modalInstance",'Map',function ($scope, $modalInstance, Map){
  $scope.items="Loading..."
  Map.getClosestRestaurant(function(value){
    console.log('name',value['name'])
    $scope.items = "Closest restraunt "+value['name'];
    $scope.$digest()
  })
 
  $scope.ok=function(){
    $modalInstance.close()
  }

}])
