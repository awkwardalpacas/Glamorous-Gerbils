nomNow.controller("modalctrl", ["$scope","$modal","Map",function ($scope,$modal,$log,Map) {
  $scope.items = "rusty bar"
  $scope.reportpage= function(){
    var modalInstance = $modal.open({
      templateUrl: 'Report.html',
      controller: 'ModalInstanceCtrl',
      size: 'lr',
      resolve: {
        items: function () {
          return $scope.itmes ;

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
.controller('ModalInstanceCtrl',["$scope","$modalInstance",'Map',"$http",function ($scope, $modalInstance, Map, $http){
  $scope.items="Loading..."
  $scope.waittime={};
  var restaurant;
  Map.getClosestRestaurant(function(value){
    console.log(value)
    restaurant=value;
    $scope.items = "Closest restaurant "+value['name'];
    $scope.$digest()
  })
  $scope.waittime.inputs ='30'
  $scope.ok=function(){
    var info= {data:{google_id:restaurant.google_id,
      name:restaurant.name,
      longitude: restaurant.location["D"],
      latitude: restaurant.location["k"],
      'wait':$scope.waittime.inputs}}
    console.log(info)
    $http({
      method: 'POST',
      url: '/wait',
      data: info
    })
    $modalInstance.close()
  }
  $scope.no=function(){
    $modalInstance.close()
  }

}])
