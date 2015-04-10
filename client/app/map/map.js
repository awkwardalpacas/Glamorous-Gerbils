angular.module('nomNow.map', ['ui.bootstrap'])


.controller('mapController', function ($scope, $location, $q, Map) {
  var createMap = function() {
    Map.createMap();
  }

  var findWaitTimes = function() {
    Map.findWaitTimes();
  }

  createMap();
  findWaitTimes();

})


////////////////-------------vishal.edit(Modal)-------//////////////
.controller("modalctrl", ["$scope","$modal",function ($scope,$modal,$log) {
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
    //dont know why bug docs say to use this
    modalInstance.result.then(function(selectedItem){
    
      $scope.selected= selectedItem;
      },function(){
        $log.info('Modal dismissed at: ' + new Date());
    }) 
    console.log('click works')
  }
}])
.controller('ModalInstanceCtrl',["$scope","$modalInstance",function ($scope, $modalInstance, items){
 
  $scope.items=items; 
  $scope.ok=function(){
    $modalInstance.close()
  }

}])
