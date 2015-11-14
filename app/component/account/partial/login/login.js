angular.module('account').controller('LoginCtrl',function($scope,  AUTHENTICATION, FcAuthService){


	$scope.credentials = {};
	$scope.rememberMe = AUTHENTICATION.defaultRememberMe;

	$scope.loginFailed = false;

	$scope.submit = function( formData ){

		//console.log('form submmited :)', $scope.credentials, $scope.rememberMe );

		FcAuthService.login( 
			$scope.rememberMe, 
			$scope.credentials,
			null,
			function(){
				$scope.loginFailed = true;
			}
			);

		//$scope.rememberMe = AUTHENTICATION.defaultRememberMe;

	};

	




});