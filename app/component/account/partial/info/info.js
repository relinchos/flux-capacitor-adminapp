angular.module('account').controller('InfoCtrl',function($scope, $stateParams, $location ){

	

	$scope.infoId = $stateParams.infoId || false;

	
	$scope.title = '';
	$scope.message = ['Account process ended'];
	$scope.action = [{
		caption: 'Go to home',
		click: function(){ $location.path('/')}
	}];


	switch( $scope.infoId ){

		case 'smth':

		$scope.message = [
		'first line msg',
		'second line and so on...' 
		];
		$scope.action.push({
			caption: 'Extra button added',
			click: function(){ console.log('action executed')}
		});

		break;

	};



});