angular.module('omniFileManager').factory('omniFileManager', function( $modal, FcSession, _, FileUploader) {


	var private = {};

	function omniFileManager( options ){ 

		private.settings = _.extend({}, options);

	};


	omniFileManager.prototype.pickAFile = function( options, cb ){ 

		if( _.isFunction( options) ){
			var cb = options;
		};

		console.log('opening file picking modal');

		var defaultSettings = {
			fileType: {
				typeText: 'image',
				extension: [],
			},
			context: {
				actionTitle: 'Upload file'
			},
			destination: {
				url: '/api/files/upload', 
			},
			relatedTo: {
				model: 'person',
				id: '',
				property: ''
			}
		};

		var settings = _.extend( defaultSettings, options || {} );

		

		var options = options || {};
		var context = settings.context || {};

		var formDataOptions = {
			//fileName: 'custon_filename'
		};

		context.destination = settings.destination || {};
		context.authorization = settings.authorization || FcSession.authorization;

		context.imageProperties = private.settings.imageProperties;




		// Uploader

		context.uploader = new FileUploader({
			queueLimit: 1,
			headers: {
				authorization: context.authorization
			},
			url: context.destination.url,
		});

		context.uploadedItemsReadyToShow = [];

		context.uploader.onAfterAddingFile = function(item) {
			//console.log( item );

			// $scope.uploadedFile = item;
			// $scope.setSubState('upload');

			setTimeout(function(){
				item.upload();
			}, 300);
			
		}; 

		context.uploader.onBeforeUploadItem = function(item) {
			formData = [{
				options: JSON.stringify( formDataOptions )
			}];
			Array.prototype.push.apply(item.formData, formData);
		};


		context.uploader.onCompleteAll = function(){
			setTimeout(function(){

			}, 800);
		};


		context.uploader.onSuccessItem = function(item, response, status, headers) {

			item.fileData = response.result;

		};





		var modalInstance = $modal.open({
			size: 'lg',
			resolve: {
				context: function(){ return context; }
			},
			templateUrl: 'app/common/web_component/omni-file-manager/template/filePicker-minimal.html',
			controller: 'omniFileManager-filePickerController'
		}).result.then(function(result){

			//console.log('file modal closed with OK', context.fileData );

			if(_.isFunction( cb )){
				cb ( context.fileData );
			};
		});
	};

	return omniFileManager;
});





