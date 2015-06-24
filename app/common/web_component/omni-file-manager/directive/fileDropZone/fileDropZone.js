angular.module('omniFileManager').directive('fileDropZone', function( ) {
	return {
		restrict: 'EA',
		transclude: true,
		replace: false,
		scope: {
			uploader: '='
		},
		templateUrl: 'app/common/web_component/omni-file-manager/directive/fileDropZone/fileDropZone.html',
		link: function(scope, element, attrs, fn) {

			


		}
	};
});
