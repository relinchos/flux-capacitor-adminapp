angular.module('formEdit', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('formEdit').config(function($stateProvider) {

	var modulePath = 'app/component/form-edit/';

	$stateProvider.state('formEdit', {
		url: 'form-edit',
		//abstract: true,
		parent: 'main',
		views: {
			'subnavbar': {
				template: 'form edit',
				controller: function($state, $scope){
					$scope.state = $state;
				}
			},
			'body': {
				template: '<div ui-view><div ng-include="\''+ modulePath +'partial/list/list.html\'"</div></div>'
			}
		},
		data: {
			auth: {
				role: ['admin','teacher']
			}
		}
		,
	});

	$stateProvider.state('formEdit.list', {
		url: '/list',
		templateUrl: modulePath + 'partial/list/list.html'
	});
	$stateProvider.state('formEdit.edit', {
		url: '/edit/:formData',
		templateUrl: modulePath + 'partial/edit/edit.html'
	});
	/* Add New States Above */

});

