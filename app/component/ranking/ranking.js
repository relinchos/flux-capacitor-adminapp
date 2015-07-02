angular.module('ranking', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('ranking').config(function( $stateProvider, $urlRouterProvider ) {

	var modulePath = 'app/component/ranking/';

	$stateProvider.state('ranking', {
		url: '/ranking',
		parent: 'main',
		views: {
			'body': {
				templateUrl: modulePath + 'partial/ranking/ranking.html'
			}
		},
		data: {
			title: 'Ranking',
			modulePath: modulePath
		}
	});
	/* Add New States Above */

});

