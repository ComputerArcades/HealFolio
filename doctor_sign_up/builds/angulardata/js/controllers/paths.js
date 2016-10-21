myApp.controller('PathController',
  ['$scope', '($scope, $location) ',
  function($scope, $location) {
  
  $scope.pathfinder = function() {
    $location.path('/patient_register');
  }; 
  

}]); // Controller