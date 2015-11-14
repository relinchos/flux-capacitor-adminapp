angular.module('landing', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('landing').config(function($stateProvider) {


	var modulePath = 'app/component/landing/';

	$stateProvider.state('landing', {
		url: '/',
		parent: 'main',
		views: {
			'body': {
				templateUrl: modulePath + 'partial/landing/landing.html'
			}
		},
		data: {
			title: 'Landing',
			modulePath: modulePath
		}
	});


    /* Add New States Above */

});

