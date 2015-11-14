angular.module('account')
.factory('FcAuthService', function ( $http, $state, LoopBackAuth, FcSession, User, _, FcConfig ) {
	
	var mainState = _.get(FcConfig, 'app.mainState', 'main');
	
	var authService = {};
	var loginBlockedRoute = false;

	authService.isAuthenticated = false;


	authService.login = function ( rememberMe, credentials, sucCb, failCb ) {

		// Loopback specific login:
		User.login(
			{ rememberMe: rememberMe }, 
			credentials, 

			// Success
			function(res){
				console.log('login suc!', res );
				var user = res.user;
				var idsession = res.id;
				FcSession.create( idsession, user, rememberMe, function( session ){ 
					session.user.roles.push('authenticated');
					$state.go( mainState );
				} );

				if (_.isFunction( sucCb )){
					sucCb();
				};
			},

			// Fail
			function(res){
				console.error('login err!', res );

				if(res.data && res.data.errorReason ){

					console.log( res.data.errorReason  );

					switch( res.data.errorReason ){
						case 'needVerification':
						$state.go('account.needEmailVerification');
						break;
					};
				} else {
					// Deal with common error
					if (_.isFunction( failCb )){
						failCb();
					};
				}

			});

	};


	authService.logout = function ( stateToGo ) {

		var killAppSession = function(){
			FcSession.destroy();
			$state.go( stateToGo ||  mainState );
		}; 

		// Loopback specific logout:

		User.logout( 
			null,
			// Success
			killAppSession,
			// Fail
			function(){ 
				// If logout can't connect to server, kill the local "session" & its data anyway
				console.warn('Couldn\'t reach server. Logging out only on client side.' );

				LoopBackAuth.clearUser();
				LoopBackAuth.clearStorage();
				killAppSession();

			});	
	};


	authService.signup = function (  rememberMe, credentials, sucCb, failCb ) { 
		User.create(
			credentials, 
			function(res){
				console.log('signup suc!', res );
				authService.login( rememberMe, credentials, sucCb, failCb );
			},
			function(res){
				console.error('signup err!', res );
				if(typeof failCb === 'function'){ failCb( res ) };
			});
	};



	authService.sendEmailVerification = function(){
		User.confirm();
	};


	authService.isAuthenticated = function () {
		return !!FcSession.loggedIn;
	};


	authService.isAuthorized = function ( authorizedRoles ) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(FcSession.userRole) !== -1);
	};


	authService.changePassword = function( credentials, sucCb, failCb ){
		User.changePassword( credentials, function( value, httpResponse ){

				authService.logout('account.login');

				if (_.isFunction( sucCb )){
					sucCb( value, httpResponse );
				};

		}, failCb );
	};


	authService.resetPassword = function( userEmail, sucCb, failCb ){
		User.resetPassword( {"email": userEmail }, sucCb, failCb );
	};





	return authService;
})