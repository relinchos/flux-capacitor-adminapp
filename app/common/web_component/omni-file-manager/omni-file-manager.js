angular.module('omniFileManager', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'angularFileUpload', 'ngCropper']);

angular.module('omniFileManager')
.config(function($stateProvider ) {

	/* Add New States Above */

}) // .config

.controller('omniFileManager-filePickerController', function( $scope, $injector, _, context, $timeout, Cropper ){


	var externalConfig = {};
	if($injector.has('appWideSettings')){
		externalConfig = $injector.get('appWideSettings').fileUploaderOptions || {};
	};

	


	$scope.content = {
		title: context.actionTitle || 'File Manager',
	};

	$scope.currentSubStateName = 'chooseFile'; //'filePreview';
	$scope.currentSubStateObj;

	$scope.setSubState = function( name ){
		$scope.currentSubStateName	= name;
		$scope.currentSubStateObj	= $scope.subStateList[name];
		return $scope.currentSubStateObj;
	};


	$scope.subStateList = {
		filePreview: {
			title: 'File Preview',
			fileData: {}
		},
		chooseFile: {
			title: 'Choose a file',
		},
		uploading: {
			title: 'Uploading',
		},
		selectFolder: {
			title: 'Select Folder',
		},
		SelectFile: {
			title: 'Select File'
		}
	};



	var uploader = $scope.uploader = context.uploader;

	$scope.fileToPreview;

	uploader.onCompleteItem = function( item ){
		$timeout(function(){
			item.completedCanBeShown = true;
			$timeout(function(){
				$scope.fileToPreview = item;

				context.fileData = item.fileData;

				//console.log( $scope.fileToPreview );

				$scope.setSubState('filePreview');

				//console.log( item );

					// TODO: Crop feature
					// $timeout(showCropper, 500);

				}, 800);
		}, 650);
	};

	// uploader.onCompleteAll = function(){
	// 	$timeout(function(){
	// 		.fileData = ;
	// 	}, 1800);
	// };

	$scope.$watch('uploader.queue.length', function( newLength ){ 
		if( newLength > 0 ){
			$scope.setSubState('uploading');
		};
	});





	//  Cropper
	//  =======


	/**
   * Object is used to pass options to initalize a cropper.
   * More on options - https://github.com/fengyuanchen/cropper#options
   */
   $scope.aspect = context.imageProperties.aspectRatio;
   $scope.cropperOptions = {
    //maximize: true,
    aspectRatio: context.imageProperties.aspectRatio,
    done: function(dataNew) { console.log( dataNew )
    	data = dataNew;
    }
};

  /**
   * Showing (initializing) and hiding (destroying) of a cropper are started by
   * events. The scope of the `ng-cropper` directive is derived from the scope of
   * the controller. When initializing the `ng-cropper` directive adds two handlers
   * listening to events passed by `ng-show` & `ng-hide` attributes.
   * To show or hide a cropper `$broadcast` a proper event.
   */
   $scope.showEvent = 'show';
   $scope.hideEvent = 'hide';

   function showCropper() { $scope.$broadcast($scope.showEvent); }
   function hideCropper() { $scope.$broadcast($scope.hideEvent); }


}); // omniFileManager-filePickerController .controller




