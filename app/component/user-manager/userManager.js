angular.module('userManager', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('userManager').config(function($stateProvider) {

	var modulePath = 'app/component/user-manager/';

	$stateProvider.state('userManager', {
		url: 'user-manager',
		//abstract: true,
		parent: 'main',
		
		views: {
			'subnavbar': {
				template: 'state: {{ testo.oki }}',
				
			},
			'body': {
				template: '<div ui-view><div ng-include="\''+modulePath+'partial/list/list.html\'"</div></div>'
			}
		},
		data: {
			pageTitle: 'Users List',
			auth: {
				role: ['admin']
			}
		}
		,
	});

	$stateProvider.state('userManager.list', {
		url: '/list',
		templateUrl: modulePath + 'partial/list/list.html'
	});
	$stateProvider.state('userManager.userDetails', {
		url: '/user-details/:userId',
		templateUrl: modulePath + 'partial/details/details.html'
	});

    /* Add New States Above */

});

