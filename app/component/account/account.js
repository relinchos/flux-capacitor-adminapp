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
  $stateProvider.state('account.info', {
    url: '/info/:infoId',
    templateUrl: modulePath + 'partial/info/info.html',
    controllerUrl: 'account/partial/info/info.js'
  });
  $stateProvider.state('account.needEmailVerification', {
    url: '/needemailverification',
    templateUrl: modulePath + 'partial/needEmailVerification/needEmailVerification.html'
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


// Auth events

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

.constant('AUTHENTICATION', {
  defaultRememberMe: true
})


.run(function ($rootScope, $state, $stateParams, FcAuthService, FcSession ) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;


  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

    toState.data = toState.data || {};

    //console.log( fromState.name, toState.name  );

    // Dealing with login redirections
    // ===============================

    // Going to login:

    if ( _.contains(['account.login'], toState.name )){ 
      toState.data.previousState = {
        name: fromState.name,
        params: fromParams
      };
      return;
    };

    // Comming from login:

    if ( _.contains(['account.login'], fromState.name )){
      if( fromState.data.previousState && fromState.data.previousState.name ){ 
       event.preventDefault(); 
       var previous = fromState.data.previousState;
       fromState.data.previousState = false;
       $state.go( previous.name );
       return;
     };
   };


    // Check if Authenticated
    // ======================
    // toState.goOptions.authenticate && 
    if (!FcAuthService.isAuthenticated()){
      console.error('<!> User not authenticated.')
        // User isn’t authenticated
        event.preventDefault(); 
        $state.go("account.login");
        return;
    };



    // Dealing with authorization
    // ==========================

    var rolesNeeded = toState.data.auth ? toState.data.auth.role : []  || [];
    rolesNeeded = _.isArray( rolesNeeded ) ? rolesNeeded : [ rolesNeeded ];
    var rolesNeededLen = rolesNeeded.length;
    var userRoles = FcSession.loggedIn ? FcSession.user.roles : [];

    
    var canPass = true;

    if ( rolesNeededLen ){
      var matches = 0; 

      _.forEach( rolesNeeded, function(roleNeeded){
        matches += _.contains(userRoles, roleNeeded ) ? 1 : 0;
      });

      // TODO: Add support for AND & OR logicals
      //canPass = rolesNeededLen === matches;
      canPass = matches > 0;

    } else {
      // no specific role needed, leave default canPass
    };


    if ( !canPass ) {
      event.preventDefault(); 
      alert('authorization needed');
    }

    //console.log('state change, role needed: ', rolesNeeded, 'you have:',userRoles );



  });
});



