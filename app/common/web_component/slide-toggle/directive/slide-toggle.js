angular.module('slideToggle').directive('slideToggle', function() {
	return {
		restrict: 'A',
		scope :{ slideToggle:'='},
		link: function(scope, element, attrs, fn) {

			

			

			scope.$watch('slideToggle', function( newVal ){
				
				if( newVal ){

					element.slideDown();
				}else{
					element.slideUp();
				};

			});

		}
	};
});