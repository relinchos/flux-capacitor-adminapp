angular.module('userProfile', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('userProfile').config(function($stateProvider, $urlRouterProvider) {


	var modulePath = 'app/component/user-profile/';

	$stateProvider.state('profile', {
		url: '/profile',
		parent: 'main',
		views: {
			'body': {
				templateUrl: modulePath + 'partial/userProfile/userProfile.html',
				controller: 'UserprofileCtrl'
			}
		},
		data: {
			title: 'User Profile',
			modulePath: modulePath
		},
		resolve: {
			resolvedPerson: function( Person, FcSession ){

				var userId = FcSession.user.person.id;

				return Person.findById({ id: userId }, function(thePerson){
					return thePerson;
				});

				//console.log( ' person resolved: ->', personData );

				//return personData;
			}
		}
	});

	/* Add New States Above */

});

