angular.module('config').factory('FcConfigMenu',function() {

	var FcConfigMenu = {
		menuList: [
			// {
			// 	caption: 'Dashboard',
			// 	icon: 'fa fa-dashboard',
			// 	uisref: 'main',
			// 	color: '#EC8F79'
			// },
			{
				caption: 'People',
				icon: 'fa fa-users',
				dropdown: 
				[
					{
						caption: 'All',
						uisref: 'person({ "filter": ""})',
						icon: ''
					},
					{
						caption: 'Students',
						uisref: 'person({ "filter": "student"})',
						icon: ''
					},
					{
						caption: 'Teachers',
						uisref: 'person({ "filter": "teacher"})',
						icon: ''
					},
					{
						caption: 'Staff',
						uisref: 'person({ "filter": [ "principal", "coordinator" ] })',
						icon: ''
					}
				]
			},
			// {
			// 	caption: 'Courses',
			// 	icon: 'fa fa-cubes',
			// 	dropdown: 
			// 	[
			// 		{
			// 			caption: 'All',
			// 			uisref: 'course({ "filter": ""})',
			// 			icon: ''
			// 		},
			// 		// {
			// 		// 	caption: 'New',
			// 		// 	uisref: 'course({ "filter": "student"})',
			// 		// 	icon: ''
			// 		// },
			// 		// {
			// 		// 	caption: 'Teachers',
			// 		// 	uisref: 'course({ "filter": "teacher"})',
			// 		// 	icon: ''
			// 		// },
			// 		// {
			// 		// 	caption: 'Staff',
			// 		// 	uisref: 'course({ "filter": [ "principal", "coordinator" ] })',
			// 		// 	icon: ''
			// 		// }
			// 	]
			// }
		]
	};

	return FcConfigMenu;
});