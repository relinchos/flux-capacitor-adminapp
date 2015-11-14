angular.module('main', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('main')

.config(function($stateProvider) {

	var modulePath = 'app/component/main/';


	$stateProvider.state('main', {
        url: '/',
        template: '<div base-layout></div>',
        data: {
			title: 'Mainboard',
			modulePath: modulePath,
			auth: {
				role: ['admin','principal','coordinator']
			}
		},
    });


	/* Add New States Above */




}) // ends .config

.run(function ( $rootScope, $state, $modal  ) {


	 

}); // Ends .run 

