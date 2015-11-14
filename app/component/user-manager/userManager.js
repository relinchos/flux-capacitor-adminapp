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
		},

		resolve: {
			resolvedRoleList:  function( Role ) {
				return Role.find().$promise.then(function( respRoleList ){
					var tempList = _.pluck( respRoleList, 'name');
					var roleList = [];
					for (var i=0; i < tempList.length; i++) {
						roleList.push( tempList[i] );
					};
					return roleList;
				});
			},
			resolvedUserList: function( User ){
				return User.find().$promise.then(function( theUserList ){ return theUserList });
		}
		}
	});

	$stateProvider.state('userManager.list', {
		url: '/list',
		templateUrl: modulePath + 'partial/list/list.html'
	});


// $stateProvider.state('userManager.userDetails', {
// 	url: '/user-details/:userId',
// 	templateUrl: modulePath + 'partial/details/details.html'
// });

	$stateProvider.state('userManager.userDetails', {
		url: '/user-details/:userId',
    templateUrl: modulePath + 'partial/details/details.html',
    controller: 'UserDetailsCtrl',
    data: {
       pageTitle: 'User Details',
       modulePath: modulePath,
       stateAction: 'details',
       allowGoBack: true
   },
	});



    /* Add New States Above */

});

