angular.module('formEdit').controller('EditCtrl',function($scope, $stateParams ){

	$scope.formData = $stateParams.formData;
	$scope.myForm = angular.fromJson( $scope.formData || { schema: {}} ); //;


});