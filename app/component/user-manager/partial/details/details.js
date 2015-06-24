angular.module('userManager').controller('userDetailsCtrl',function($scope, $stateParams, User ){

	$scope.userId = $stateParams.userId;

	//$scope.formData = $stateParams.formData;
	//$scope.userId = angular.fromJson( $scope.formData || { schema: {}} ); 

 	$scope.user = User.findOne({ filter: { where: { id: $scope.userId }} });


});