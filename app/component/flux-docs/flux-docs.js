angular.module('fluxDocs', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('fluxDocs').config(function($stateProvider) {

	var modulePath = 'app/component/flux-docs/';


	$stateProvider.state('flux-docs', {
		url: 'flux-docs',
		//abstract: true,
		parent: 'main',
		views: {
			'subnavbar': {
				template: '<b>flux docs</b>',
				controller: function($state, $scope){
					$scope.state = $state;
				}
			},
			'body': {
				template: '<div ui-view></div>'
			}
		},
		data: {
			pageTitle: 'Flux Capacitor Documentation',
			auth: {
				role: ['admin' ]
			},
		}
		,
	});


	$stateProvider.state('flux-docs.dependenciesDocs', {
        url: '/dependencies-docs',
        templateUrl: modulePath + 'partial/dependencies-docs/dependencies-docs.html',
        data: {
        	pageTitle: 'Dependencies Documentation',
        	stateAction: 'create' 
        },
    });

    /* Add New States Above */

});

