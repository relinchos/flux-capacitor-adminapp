angular.module('account', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('account')

.config(function($stateProvider) {

  var modulePath = 'app/component/account/';

  $stateProvider.state('account', {
    url: '/account',
    abstract: false,
    //parent: 'main',
    template: '<div ui-view></div>',
  });

  $stateProvider.state('account.login', {
   url: '/login',
   templateUrl: modulePath + 'partial/login/login.html'
 });
  $stateProvider.state('account.signup', {
    url: '/signup',
    templateUrl: modulePath + 'partial/signup/signup.html'
  });
  $stateProvider.state('account.resetPassword', {
    url: '/reset_password',
    templateUrl: modulePath + 'partial/reset_password/reset_password.html',
    goOptions: {
      authenticate: false
    } 
  });
  $stateProvider.state('account.changePassword', {
    url: '/change_password/:accessToken',
    templateUrl: modulePath + 'partial/change_password/change_password.html',
    goOptions: {
      authenticate: false
    }
  });
  $stateProvider.state('account.info', {
    url: '/info/:infoId',
    templateUrl: modulePath + 'partial/info/info.html',
    controllerUrl: 'account/partial/info/info.js'
  });
  $stateProvider.state('account.needEmailVerification', {
    url: '/needemailverification',
    templateUrl: modulePath + 'partial/needEmailVerification/needEmailVerification.html'
  });
  $stateProvider.state('account.unauthorized', {
    url: '/unauthorized',
    templateUrl: modulePath + 'partial/unauthorized/unauthorized.html'
  });
  $stateProvider.state('settings', {
    parent: 'main',
    url: 'account/settings',
    views: {
      body: {
        templateUrl: modulePath + 'partial/settings/settings.html'
      }
    }

  });
  /* Add New States Above */





})

.constant('AUTHENTICATION', {
  defaultRememberMe: true
})


.run(function ($rootScope, $state, $stateParams, FcAuthService, FcSession, FcConfig ) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;


  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

    toState.data = toState.data || {};

    //console.log( fromState.name, toState.name  );


    // Dealing with unauthorized
    // =========================


    if ( _.contains(['account.unauthorized'], toState.name )){ 
      //event.preventDefault(); 
      console.log('unauthorized')
      return;
    };


    // Dealing with login redirections
    // ===============================

    // Going to login:

    if ( _.contains(['account.login','account.signup'], toState.name )){ 
      toState.data.previousState = {
        name: fromState.name,
        params: fromParams
      };

      if ( FcAuthService.isAuthenticated() ) {
        event.preventDefault(); 
        $state.go('main');
      };
      
      return;
    };


    // Comming from login:

    if ( _.contains(['account.login'], fromState.name )){
      if( !_.contains( toState.name, 'account' )){
      if( fromState.data.previousState && fromState.data.previousState.name ){ 
          if( !_.contains( fromState.data.previousState.name, 'account' )){
       event.preventDefault(); 
       var previous = fromState.data.previousState;
       fromState.data.previousState = false;
       $state.go( previous.name );
       return;
     };
   };
     };
   };


    // Check if Authenticated
    // ======================
    // toState.goOptions.authenticate && 


    var goOptions = toState.goOptions || {};

    if( !_.isUndefined(goOptions.authenticate) && !goOptions.authenticate  ){

    }else{


      if ( !FcAuthService.isAuthenticated() ){
      console.error('<!> User not authenticated.')
        // User isn’t authenticated
        event.preventDefault(); 
        $state.go("account.login");
        return;
    };
    };


    // Dealing with authorization
    // ==========================

    var canPass = true;
    var matches = 0; 
    var userRoles = FcSession.loggedIn ? FcSession.user.roles : [];

    
    // APP LEVEL

    var appRolesNeeded = _.get( FcConfig, 'app.auth.role', [] );
    appRolesNeeded = _.isArray( appRolesNeeded ) ? appRolesNeeded : [ appRolesNeeded ];


    if( appRolesNeeded.length ){
      _.forEach( appRolesNeeded, function(roleNeeded){
        matches += _.contains(userRoles, roleNeeded ) ? 1 : 0;
      });

      if( matches <= 0 ){
        event.preventDefault(); 
        console.error('APP LEVEL - Authorization needed');
        $state.go('account.unauthorized');
        return;
      };   
    };


    // STATE LEVEL

    matches = 0
    var stateRolesNeeded = _.get( toState, 'data.auth.role', [] );
    stateRolesNeeded = _.isArray( stateRolesNeeded ) ? stateRolesNeeded : [ stateRolesNeeded ];
    

    if( stateRolesNeeded.length ){
      _.forEach( stateRolesNeeded, function(roleNeeded){
        matches += _.contains(userRoles, roleNeeded ) ? 1 : 0;
      });

      if( matches <= 0 ){
        event.preventDefault(); 
        console.error('STATE LEVEL - Authorization needed');
        var mainState = _.get(FcConfig, 'app.mainState', 'main');
        $state.go(mainState);
        return;
      };   
    };

    
    

    // if ( stateRolesNeeded.length ){
    //   var matches = 0; 

    //   _.forEach( stateRolesNeeded, function(roleNeeded){
    //     matches += _.contains(userRoles, roleNeeded ) ? 1 : 0;
    //   });

    //   // TODO: Add support for AND & OR logicals
    //   //canPass = stateRolesNeededLen === matches;
    //   canPass = matches > 0;

    // } else {
    //   // no specific role needed, leave default canPass
    // };


    // if ( !canPass ) {
    //   event.preventDefault(); 
    //   console.error('authorization needed');
    //   if ( !FcAuthService.isAuthenticated() ){
    //     $state.go('account.login');
    //   };
    // };

    //console.log('state change, role needed: ', stateRolesNeeded, 'you have:',userRoles );



  });
});