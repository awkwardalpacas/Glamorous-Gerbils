nomNow.controller("modalctrl", ["$scope","$modal","Map",function ($scope,$modal,$log,Map) {
  $scope.reportpage= function(){
    // the modal is a popup below is a tamplate feature of angular.
    var modalInstance = $modal.open({
      templateUrl: 'Report.html',
      controller: 'ModalInstanceCtrl',
      size: 'lr',
      
  })
    //the angular docs required this step. the popup does not work without this
    modalInstance.result.then(function(selectedItem){
      $scope.selected= selectedItem;
      },function(){
        $log.info('Modal dismissed at: ' + new Date());
    }) 
  }
}])

.controller('ModalInstanceCtrl',["$scope","$modalInstance",'Map',"$http",function ($scope, $modalInstance, Map, $http){
  // loading exists till it finds the closest 
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
  // on ok the function makes a "POST" request to the server.
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
  // no does not do anyting. just cuts off any actions.
  $scope.no=function(){
    $modalInstance.close()
  }

}])
