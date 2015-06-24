angular.module('baseLayout').directive('baseLayout', function( FcSession, LoopBackAuth, $state, $rootScope  ) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			
		},
		templateUrl: 'app/common/web_component/base_layout/directive/baseLayout/baseLayout.html',
		link: function(scope, element, attrs, fn) {

			scope.LoopBackAuth = LoopBackAuth;
			scope.FcSession = FcSession;

			scope.state = $state.current ;


			scope.anda = '< system ok >';			


		}
	};
});
