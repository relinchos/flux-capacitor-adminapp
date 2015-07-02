				
angular.module('userProfile').controller('userProfileImgCropModalCtrl',function($scope, myImage, context ){

	console.log( myImage );

	$scope.myImage = myImage;

	$scope.myCroppedImage = context.myCroppedImage;

	$scope.$watch('myCroppedImage', function(newValue, oldValue) {
		console.log('changed')
	});




});