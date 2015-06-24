angular.module('course', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('course').config(function($stateProvider) {

	var modulePath = 'app/component/course/';

	/* Add New States Above */

	$stateProvider.state('course', {
		url: 'course',///:filter
		//abstract: true,
		parent: 'main',
		views: {
			'body': {
				templateUrl: modulePath + 'partial/list/list.html',
				controller: 'CourseListCtrl',
			}
		},
		goOptions: {
			reload: true
		},
		data: {
			title: 'Courses list',
			modulePath: modulePath,
			auth: {
				role: ['admin','principal','coordinator']
			}
		},

		resolve: {
			// resolvedRoleList:  function( Role ) {
			// 	return Role.find().$promise.then(function( respRoleList ){
			// 		var tempList = _.pluck( respRoleList, 'name');
			// 		var roleList = [];
			// 		for (var i=0; i < tempList.length; i++) {
			// 			roleList.push( tempList[i] );
			// 		};
			// 		return roleList;
			// 	});
			// },

			resolvedTeachersList: function ( Person, $stateParams ){
				return Person.find( { filter: { where: { "roles": { inq:  ['teacher'] } } } });
			},

			resolvedCoursesList: function ( Course, $stateParams ){ 

				var paramFilter = $stateParams.filter || '';
				var listFilter = _.isArray( paramFilter ) ? paramFilter : paramFilter.split(',');
				var findWhere = {};

				if( paramFilter ){
					findWhere = { filter: { where: { "roles": { inq:  listFilter } } } };
				};

				return Course.find( findWhere );
			} 
		}
	});


$stateProvider.state('course.create', {

    url: '/create/',
    templateUrl: modulePath + 'partial/details/details.html',
    controller: 'CourseDetailsCtrl',
    data: {
       title: 'Creating Course',
       stateAction: 'create',
       allowGoBack: true
   }
});


$stateProvider.state('course.details', {
	url: 'details/:courseId',
	templateUrl: modulePath + 'partial/details/details.html',
	controller: 'CourseDetailsCtrl',
	data: {
		title: 'Course Details',
		modulePath: modulePath,
		stateAction: 'details',
		allowGoBack: true
	},
});

});

