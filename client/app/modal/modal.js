nomNow.controller("modalctrl", ["$scope","$modal","Map",function ($scope,$modal,$log,Map) {
  $scope.reportpage= function(){
    // the modal is a popup below is a tamplate feature of angular.
    var modalInstance = $modal.open({
      templateUrl: 'Report.html',
      controller: 'ModalInstanceCtrl',
      size: 'lr',
      
  });
    //the angular docs required this step. the popup does not work without this
    modalInstance.result.then(function(selectedItem){
      $scope.selected= selectedItem;
      },function(){
        $log.info('Modal dismissed at: ' + new Date());
    }) 
  }
}])

.controller('ModalInstanceCtrl',["$scope","$modalInstance",'Map',"$http",function ($scope, $modalInstance, Map, $http){
  //this makes the options invisible till they are needed.
  // $scope.manual = {'visibility' :"collapse","height":"0px","width":"0px"};
  // $scope.buttons = {'visibility' :"collapse"};
  // loading exists till it finds the closest result 
  $scope.Rlist = {'visibility' :"visible"};
  $scope.items="Loading...";
  $scope.waittime={};
  $scope.restaurant={};
//get close lets us change the text at the start.
  var getclose = function(){
    Map.getClosestRestaurant(function(value){
      $scope.restaurant=value;
      $scope.items = "Choose the restaurant you are located at.";
      // $scope.buttons = {'visibility' :"visible"};
      $scope.$digest();
    }) 
  };

  getclose();
  // this lets 30 be defalut text till input changes
  $scope.waittime.inputs ='30';
  // below are the button functions for the modal
 
  $scope.yes=function(choice){
    $scope.items= "Enter the wait time for "+choice['name']+".";
    $scope.restaurant = [choice];
    $scope.Rlist ={'visibility':'collapse',"height":"0px","width":"0px"};
    // $scope.buttons = {'visibility' :"collapse", "height":"0px","width":"0px"};

  }

  // $scope.no=function(){
  //   $scope.buttons =  {'visibility' :"collapse", "height":"0px","width":"0px"};
  //   $scope.manual = {'visibility' :"visible"};
  //   $scope.items="Tell us where you are.";
  // }

  $scope.cancel=function(){
    $modalInstance.close();
  }

  // $scope.ok =function(){
  //  var n = $scope.manualinput;
  //   Map.getClosestRestaurant(function(value){
  //     if(value['name']){
  //     restaurant=value;
  //     $scope.items = "Are you  at : "+value['name']+"?";
  //     $scope.buttons = {'visibility' :"visible"};
  //     $scope.$digest();
  //     }
  //     else{
  //        $scope.items = "sorry no location found";
  //         $scope.manual = {'visibility' :"visible"};
  //         $scope.$digest();
  //     }
  //   },n);      
  //   $scope.manual = {'visibility' :"collapse"};
  // }
  //on submit we have a success to get new wait times form the server
  $scope.submit= function(){
    var info= {data:{google_id:$scope.restaurant[0]['google_id'],
      name:$scope.restaurant[0]['name'],
      longitude: $scope.restaurant[0].location["D"],
      latitude: $scope.restaurant[0].location["k"],
      'wait':$scope.waittime.inputs}};
    $http({
      method: 'POST',
      url: '/wait',
      data: info
    }).success(function(){
      Map.findWaitTimes();
    });
    $modalInstance.close();
  };

}]);
