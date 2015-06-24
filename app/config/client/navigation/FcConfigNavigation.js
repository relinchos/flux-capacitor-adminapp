angular.module('config').factory('FcConfigNavigation',function() {

	var FcConfigNavigation = {

		navbar: 
		[
		{
			caption: 'Home',
			uisref: 'main'
		},
		// {
		// 	caption: 'Person',
		// 	uisref: 'person'
		// },
		{
			caption: 'User',
			roles: ['admin'],
			uisref: 'userManager'
		},
		// {
		// 	caption: 'Tools',
		// 	roles: ['admin'],
		// 	dropdown: 
		// 	[
		// 	{ 
		// 		caption: 'Form editor',
		// 		uisref: 'formEdit',
		// 	},

		// 	{ 
		// 		topDivider: true,
		// 		caption: 'Disabled example',
		// 		disabled: true
		// 	}
		// 	]
		// },
		{
			caption: 'Flux Docs',
			roles: ['admin'],
			dropdown: 
			[
			{ 
				caption: 'Dependencies Docs',
				//roles: ['admin'],
				uisref: 'flux-docs.dependenciesDocs'
			},
			{ 
				caption: 'LoopBack Angular Services',
				href: '/docular_generated'
			},
			{ 
				caption: 'LoopBack API Explorer',
				href: '/explorer'
			}
			]
		}
		]

	};


	return FcConfigNavigation;
});