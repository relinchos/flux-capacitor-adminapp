angular.module('landing').controller('LandingCtrl',function($scope, FcSession, Person, $timeout ){


	// DATA

	$scope.session = FcSession;
	$scope.loadingInfo = false;

	$scope.test = 'ok';
	



	
});