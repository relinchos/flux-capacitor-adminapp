angular.module('account').controller('LoginCtrl',function($scope,  AUTHENTICATION, FcAuthService){


	$scope.credentials = {
		email: '',
		password: ''
	};
	$scope.rememberMe = AUTHENTICATION.defaultRememberMe;

	$scope.loginFailed = false;



	$scope.submit = function( formData ){

		$scope.loginFailed = false;

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