angular.module('person', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('person').config(function($stateProvider, $urlRouterProvider) {

	var modulePath = 'app/component/person/';

    $stateProvider.state('person', {
      url: 'person/:filter',
		//abstract: true,
		parent: 'main',
        views: {
            'body': {
              templateUrl: modulePath + 'partial/list/list.html',
              controller: 'PersonListCtrl',
          }
      },
      goOptions: {
        reload: true
    },
    data: {
     title: 'People list',
     modulePath: modulePath,
     auth: {
        role: ['admin','principal','coordinator']
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
    resolvedPeopleList: function ( Person, $stateParams ){ 

        var paramFilter = $stateParams.filter || '';

        var listFilter = _.isArray( paramFilter ) ? paramFilter : paramFilter.split(',');
        var findWhere = {};

        if( paramFilter ){
            findWhere = { filter: { where: { "roles": { inq:  listFilter } } } };
        };

        return Person.find( findWhere );



    } 
}

});


$stateProvider.state('person.create', {

    url: '/create/',
    templateUrl: modulePath + 'partial/details/details.html',
    controller: 'PersonDetailsCtrl',
    data: {
       title: 'Creating Person',
       stateAction: 'create',
       allowGoBack: true
   }
});

$stateProvider.state('person.details', {
    url: 'details/:personId',
    templateUrl: modulePath + 'partial/details/details.html',
    controller: 'PersonDetailsCtrl',
    data: {
       title: 'Person Details',
       modulePath: modulePath,
       stateAction: 'details',
       allowGoBack: true
   },
});

    // $urlRouterProvider.when('/person', '/person/list/');
    // $urlRouterProvider.when('/person/', '/person/list/');

    /* Add New States Above */

});

