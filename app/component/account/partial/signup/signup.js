angular.module('account').controller('SignupCtrl',function($scope, FcAuthService){


	$scope.credentials = {};
	$scope.signupFail = false;
	$scope.failMsg = '';

	$scope.submit = function( formData ){ 

		$scope.signupFail = false;
		$scope.failMsg = '';

		var credentials = $scope.credentials;

		FcAuthService.signup( 
			$scope.rememberMe,
			credentials,
			null,
			function( res ) {

				$scope.signupFail = true;
				$scope.failMsg= res.data.error.message;

			});


	};

});