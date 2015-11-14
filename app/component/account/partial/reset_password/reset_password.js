angular.module('account').controller('ResetPasswordCtrl',function($scope, FcAuthService ){

	$scope.showForm_askEmail = true;
	$scope.credentials = {};
	$scope.loginFailed = false;


	$scope.submitAskEmail = function( formData ){

		$scope.busy = true;
		$scope.loginFailed = false;
		$scope.submitting = true;

		if( $scope.userEmail ){

			FcAuthService.resetPassword( 
				$scope.userEmail, 
				function( value, responseHeaders ){
					$scope.busy = false;
					$scope.submitting = false;

					$scope.showForm_askEmail = false;
					$scope.showNotif_emailSent = true;

				},
				function( httpResponse ){
					$scope.busy = false;
					$scope.submitting = false;

					var data = httpResponse.data;
					var err = data.error || {};
					$scope.errorMessage = '';

					switch( err.code ){

						case 'EMAIL_REQUIRED':
						$scope.errorMessage =  'Es necesario que ingreses una dirección de e-mail.';
						break;

						case 'INVALID_EMAIL':
						$scope.errorMessage =  'No es un e-mail válido. Chequealo por favor.';
						break;

						default:
						$scope.errorMessage =  err.message;
					};

					$scope.loginFailed = true;

				}
				);
		};
	};	





});