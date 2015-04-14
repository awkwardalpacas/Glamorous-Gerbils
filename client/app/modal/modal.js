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
  var restraunt;
  Map.getClosestRestaurant(function(value){
    console.log(value)
    restraunt=value;
    $scope.items = "Closest restraunt "+value['name'];
    $scope.$digest()
  })
  $scope.waittime.inputs ='30'
  $scope.ok=function(){
    var info= {data:{google_id:restraunt.google_id,
      name:restraunt.name,
      longitude: restraunt.location["D"],
      latitude: restraunt.location["k"],
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
