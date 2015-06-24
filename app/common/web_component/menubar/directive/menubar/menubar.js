angular.module('menubar').directive('menubar', function( FcConfigMenu, $state ) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {

		},
		templateUrl: 'app/common/web_component/menubar/directive/menubar/menubar.html',
		link: function(scope, element, attrs, fn) {

			var configMenu = FcConfigMenu;

			scope.state = $state;

			scope.menuList = configMenu.menuList;

			scope.menuItmClicked = function( $event, menuItm ){ 

				if( menuItm.dropdown && menuItm.dropdown.length ){

					menuItm.dropdownState = menuItm.dropdownState === undefined ? false : menuItm.dropdownState;

					menuItm.dropdownState = !menuItm.dropdownState;

				};

				if( menuItm.uisref ){

					$state.go( menuItm.uisref );

				};
			};

			// scope.checkIfActive = function( uisref ){ return;
			// 	if($state.current.name){ 
			// 		var cleanState = uisref.split('(')[0] || uisref;
			// 		if( $state.current.name ==  cleanState ){
			// 			return true;
			// 		};
			// 	};
			// 	return false;
			// };



		}
	};
});
