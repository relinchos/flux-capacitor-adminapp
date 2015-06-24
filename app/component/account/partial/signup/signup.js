angular.module('account').controller('SignupCtrl',function($scope, FcAuthService){


	$scope.credentials = {};

	$scope.submit = function( formData){

		//console.log('form submmited :)', $scope.credentials, $scope.rememberMe );

AuthService.signup( $scope.credentials );


};

});