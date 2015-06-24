angular.module('navbar').directive('navbar', function( $state, FcAuthService, FcSession, FcConfigNavigation ) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {

		},
		templateUrl: 'app/common/web_component/navbar/directive/navbar/navbar.html',
		link: function(scope, element, attrs, fn) {


			scope.state = $state;
			scope.session = FcSession;
			scope.auth = FcAuthService;

			var navigationConfig = FcConfigNavigation;
			scope.navItems = navigationConfig.navbar;


			scope.currentStateName = scope.state ? scope.state.current.name : '';


			scope.seenByCurrentRole = function( admittedRoles ){

				if( admittedRoles === undefined ){
					return true;
				};

				var seen = false;

				_.forEach( admittedRoles, function( role ){
					if(FcSession.userHasRole( role )){ 
						//console.log('admitted role'+role)
						seen = true;
						return false;
					};
				});

				return seen;
			}


		}
	};
});
