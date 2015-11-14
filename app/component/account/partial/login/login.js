angular.module('account').controller('LoginCtrl',function($scope,  AUTHENTICATION, FcAuthService){


<<<<<<< HEAD
	$scope.credentials = {};
=======
	$scope.credentials = {
		email: '',
		password: ''
	};
>>>>>>> 6cf467bd1bcce85a83b01c8683968b6e4f8b7053
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