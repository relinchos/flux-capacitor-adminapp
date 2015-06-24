angular.module('account')
.factory('FcAuthService', function ( $http, $state, LoopBackAuth, FcSession, User, _ ) {
	
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
				FcSession.create( idsession, user, rememberMe, function(){ 
					$state.go('main');
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


	authService.logout = function () {

		var killAppSession = function(){
			FcSession.destroy();
			$state.go('account.login');
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


	authService.signup = function ( credentials ) { return;
		User.create(
			credentials, 
			function(res){
				console.log('signup suc!', res );
			},
			function(res){
				console.error('signup err!', res );
			});
	};



	authService.sendEmailVerification = function(){
		User.confirm();
	};


	authService.isAuthenticated = function () {
		return !!FcSession.loggedIn;
	};


	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(FcSession.userRole) !== -1);
	};





	return authService;
})