angular.module('statenav').directive('statenav', function( StateNavigator, $state ) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {

		},
		templateUrl: 'app/common/web_component/statenav/directive/statenav/statenav.html',
		link: function(scope, element, attrs, fn) {

			scope.state = $state;

			scope.renderControls = StateNavigator.renderControls;

			scope.pageTitle = StateNavigator.getPageTitle;

			scope.getPreviousState = StateNavigator.getPreviousState;

			scope.goToPreviousState = StateNavigator.goToPreviousState;




		}
	};
});
