angular.module('account').directive('roleIcon', function( _ ) {
	return {
		restrict: 'EA',
		replace: false,
		scope: {
			roleIcon: '=roleIcon'
		},
		templateUrl: 'app/component/account/directive/roleIcon/roleIcon.html',
		link: function(scope, element, attrs, fn) {

			var roleList = scope.roleIcon;
			scope.roleList = _.isArray( roleList ) ? roleList : [ roleList ];




		}
	};
});
