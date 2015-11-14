angular.module('account').controller('ChangePasswordCtrl',function($scope,  $state, FcAuthService, $stateParams, WildcardModel, FcSession ){


	$scope.showForm_newPassword = false;
	$scope.credentials = {};
	$scope.invalidToken = false;
	$scope.loginFailed = false;

	var accessToken = $stateParams.accessToken || FcSession.id;

	if( accessToken ){
	WildcardModel.checkTokenValidity(
		{ accessToken: accessToken }, 
		function(value, responseHeaders){
			if(value.isValid){
				$scope.showForm_newPassword = true;
			} else {
				$scope.invalidToken = true;
			}
		},
		function(err){
			$scope.invalidToken = true;
		});
} else {
	$scope.invalidToken = true;
};


	$scope.submitChangePassword = function( formData ){

		$scope.loginFailed = false;
		$scope.submitting = true;

		var credentials = $scope.credentials;
		credentials.accessTokenId = accessToken;

		FcAuthService.changePassword( 
			credentials,
			function(value, httpResponse){
				$scope.submitting = false;
			},
			function(httpResponse){

				$scope.submitting = false;

				var data = httpResponse.data;
				var err = data.error || {};
				$scope.errorMessage = '';

				switch( err.code ){

					case 'CHANGE_PASS_UNMATCHING':
					$scope.errorMessage =  'Las contraseñas no coinciden.'
					break;

					case 'CHANGE_PASS_TOO_SHORT':
					$scope.errorMessage =  'La contraseña debe poseer al menos 8 caracteres.'
					break;

					default:
					if( err.status == 401 ){
						$scope.showForm_newPassword = false;
						$scope.invalidToken = true;
					}else{
						$scope.errorMessage =  err.message;
					};
				};

				$scope.loginFailed = true;
			}
			);
	};

	




});